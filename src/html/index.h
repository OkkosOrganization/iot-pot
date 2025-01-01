#include <pgmspace.h>

const char indexHtml[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WiFi asetukset</title>
    <style>
        * {
            box-sizing:border-box;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        form {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 8px;
            margin-bottom: 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        .hidden {
            display: none;
        }

       .red {
        color: red;
       }
       .yellow {
        color: yellow;
       } 
       .green {
        color: green;
       }              
    </style>
</head>
<body>
    <div>    
        <h2>WiFi:</h2>
        <form action="#" method="post" id="postForm">
            <label for="ssid">SSID</label>
            <input type="text" id="ssid" name="ssid" placeholder="Anna verkon SSID" required>
            <label for="pwd">Salasana</label>
            <input type="password" id="pwd" name="pwd" placeholder="Anna salasana" required>
            <button type="submit">Lähetä</button>
            <p id="response" class="hidden"></p>
        </form>
    </div>
    <div id="internetStatus">
        <h2>Internet connection</h2>
        <p id="internetStatusCode">
        </p>
    </div>
    <div>
        <h2>Device-ID: <span id="deviceId"></span></h2>
    </div>
    <script>
        const postForm = document.getElementById('postForm');
        postForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const ssid = document.getElementById('ssid').value;
            const pwd = document.getElementById('pwd').value;
            const responseP = document.getElementById("response");
            try {
                const response = await fetch('/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({ ssid, pwd })
                });

                if (response.ok) {
                    const result = await response.json(); // Parse JSON response
                    if (result.success === "1") {
                        responseP.innerHTML = "Tiedot tallennettu, käynnistä laite uudelleen.";
                    } else {
                        responseP.innerHTML = "Tietojen tallennus epäonnistui";
                    }
                } else {
                    responseP.innerHTML = `Virhe tietojen lähetyksessä: ${response.status}`;
                }
            } catch (error) {
                responseP.innerHTML = `<pre>Tapahtui virhe: ${error.message}</pre>`;
            }
            responseP.classList.remove("hidden");
            postForm.reset()
        });   

        
        let statusInterval;
        let statusIntervalTime = 5000;
        const internetStatusP = document.getElementById('internetStatusCode');
        const internetStatus = async () => {            
            clearInterval(statusInterval);
            try {
                const response = await fetch('/internet-status', {
                    method: 'GET',
                });
                if (response.ok) {
                    const result = await response.json(); // Parse JSON response
                    const statusCode = parseInt(result['internet-status']);
                    const ip = result['ip'];
                    internetStatusP.innerHTML = statusCode;
                    switch(statusCode)
                    {
                        case 3:
                            console.log("Online", result, statusCode, ip);
                            internetStatusP.classList.add('green');
                            internetStatusP.classList.remove('yellow');
                            internetStatusP.classList.remove('red');                            
                            internetStatusP.innerHTML = "Online</br>IP: " + ip;
                            break;
                        case 2:
                            console.log("Scanning", result, statusCode, ip);
                            internetStatusP.classList.add('yellow');
                            internetStatusP.classList.remove('green');
                            internetStatusP.classList.remove('red');
                            internetStatusP.innerHTML = "Connecting..";
                            break;                            
                        default:
                            internetStatusP.classList.add('red');
                            internetStatusP.classList.remove('yellow');
                            internetStatusP.classList.remove('green');
                            internetStatusP.innerHTML = "Offline:" + statusCode;
                            break;                            
                    }
                } else {
                    internetStatusP.innerHTML = statusCode;
                }
            } catch (error) {
                internetStatusP.innerHTML = '?';
            }
            statusInterval = setInterval(internetStatus, statusIntervalTime);
        }
        statusInterval = setInterval(internetStatus, statusIntervalTime);

        const deviceIdSpan = document.getElementById('deviceId');
        const getDeviceId = async () => {            
            try {
                const response = await fetch('/device-id', {
                    method: 'GET',
                });
                if (response.ok) {
                    const result = await response.json(); // Parse JSON response
                    const res = result['device-id'];
                    deviceIdSpan.innerHTML = res;
                } else {
                    deviceIdSpan.innerHTML = "";
                }
            } catch (error) {
                deviceIdSpan.innerHTML = '?';
            }
        }
        getDeviceId();
    </script>
</body>
</html>
)rawliteral";