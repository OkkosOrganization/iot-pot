import './style.css';

const init = () => {
  console.log('Configuration app init');
  let statusInterval = 0;
  let statusIntervalTime = 5000;
  const internetStatusP = document.getElementById('internetStatusCode');
  const deviceIdSpan = document.getElementById('deviceId');
  const postForm = document.getElementById('postForm');
  const tabLinks = document.querySelectorAll('.tabSelector a');

  const addEventListeners = () => {
    postForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const ssid = document.getElementById('ssid').value;
      const pwd = document.getElementById('pwd').value;
      const responseP = document.getElementById('response');
      try {
        const response = await fetch('/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ ssid, pwd }),
        });

        if (response.ok) {
          const result = await response.json(); // Parse JSON response
          if (result.success === '1') {
            responseP.innerHTML =
              'Tiedot tallennettu, käynnistä laite uudelleen.';
          } else {
            responseP.innerHTML = 'Tietojen tallennus epäonnistui';
          }
        } else {
          responseP.innerHTML = `Virhe tietojen lähetyksessä: ${response.status}`;
        }
      } catch (error) {
        responseP.innerHTML = `<pre>Tapahtui virhe: ${error.message}</pre>`;
      }
      responseP.classList.remove('hidden');
      postForm.reset();
    });

    tabLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const el = e.target;
        const id = el.href.split('#')[1];
        const tabToShow = document.getElementById(id);
        const activeTab = document.querySelector('.tab.active');

        if (activeTab && tabToShow) {
          activeTab.classList.remove('active');
          tabToShow.classList.add('active');
        }
      });
    });
  };

  const internetStatus = async () => {
    if (!statusInterval)
      statusInterval = setInterval(internetStatus, statusIntervalTime);

    clearInterval(statusInterval);
    try {
      const response = await fetch('/internet-status', {
        method: 'GET',
      });
      if (response.ok) {
        const result = await response.json();
        const statusCode = parseInt(result['internet-status']);
        const ip = result['ip'];
        internetStatusP.innerHTML = statusCode;
        switch (statusCode) {
          case 3:
            console.log('Online', result, statusCode, ip);
            internetStatusP.classList.add('green');
            internetStatusP.classList.remove('yellow');
            internetStatusP.classList.remove('red');
            internetStatusP.innerHTML = 'Online</br>IP: ' + ip;
            break;
          case 2:
            console.log('Scanning', result, statusCode, ip);
            internetStatusP.classList.add('yellow');
            internetStatusP.classList.remove('green');
            internetStatusP.classList.remove('red');
            internetStatusP.innerHTML = 'Connecting..';
            break;
          default:
            internetStatusP.classList.add('red');
            internetStatusP.classList.remove('yellow');
            internetStatusP.classList.remove('green');
            internetStatusP.innerHTML = 'Offline:' + statusCode;
            break;
        }
      } else {
        internetStatusP.innerHTML = statusCode;
      }
    } catch (error) {
      internetStatusP.innerHTML = '?';
    }
    statusInterval = setInterval(internetStatus, statusIntervalTime);
  };

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
        deviceIdSpan.innerHTML = '';
      }
    } catch (error) {
      deviceIdSpan.innerHTML = '?';
    }
  };

  addEventListeners();
  getDeviceId();
  internetStatus();
};
console.log('Configuration appsss, jeess');
document.addEventListener('DOMContentLoaded', init);
