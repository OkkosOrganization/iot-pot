import "./style.css";

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