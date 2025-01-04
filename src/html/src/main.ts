import './style.css';

const init = () => {
  console.log('Configuration app init!');
  let statusInterval = 0;
  let statusIntervalTime = 5000;
  const internetStatusP = document.getElementById('internetStatusCode')!;
  const deviceIdSpan = document.getElementById('deviceId')!;
  const postForm = document.getElementById('postForm')! as HTMLFormElement;
  const tabLinks = document.querySelectorAll('.tabSelector a')!;

  const addEventListeners = () => {
    postForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const ssidInputEl = document.getElementById('ssid') as HTMLInputElement;
      const ssid = ssidInputEl.value;
      const pwdInputEl = document.getElementById('pwd') as HTMLInputElement;
      const pwd = pwdInputEl.value as string;
      const responseP = document.getElementById(
        'response',
      ) as HTMLParagraphElement;
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
        if (error instanceof Error)
          responseP.innerHTML = `<pre>Tapahtui virhe: ${error?.message}</pre>`;
      }
      responseP.classList.remove('hidden');
      postForm.reset();
    });
    tabLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const el = e.target as HTMLAnchorElement;
        const id = el.href.split('#')[1];
        const tabToShow = document.getElementById(id);
        const activeTab = document.querySelector('.tab.active');
        const activeMenuItem = document.querySelector(
          '.tabSelector a.active',
        ) as HTMLAnchorElement;

        if (activeTab && tabToShow) {
          // SWITCH TAB
          activeTab.classList.remove('active');
          tabToShow.classList.add('active');

          // UPDATE MENU
          activeMenuItem.classList.remove('active');
          el.classList.add('active');
        }
      });
    });
  };

  const getInternetStatus = async () => {
    if (!statusInterval)
      statusInterval = window.setInterval(
        getInternetStatus,
        statusIntervalTime,
      );

    clearInterval(statusInterval);
    try {
      const response = await fetch('/internet-status', {
        method: 'GET',
      });
      if (response.ok) {
        const result = await response.json();
        const statusCode = parseInt(result['internet-status']);
        const ip = result['ip'];
        internetStatusP.innerHTML = statusCode.toString();
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
        internetStatusP.innerHTML = '?';
      }
    } catch (error) {
      internetStatusP.innerHTML = '?';
    }
    statusInterval = window.setInterval(getInternetStatus, statusIntervalTime);
  };

  const getDeviceId = async () => {
    try {
      const response = await fetch('/device-id', {
        method: 'GET',
      });
      if (response.ok) {
        const result = await response.json();
        const res = result['device-id'];
        deviceIdSpan.innerHTML = res;
      } else {
        deviceIdSpan.innerHTML = '...';
      }
    } catch (error) {
      deviceIdSpan.innerHTML = '...';
    }
  };

  addEventListeners();
  getDeviceId();
  getInternetStatus();
};
document.addEventListener('DOMContentLoaded', init);
