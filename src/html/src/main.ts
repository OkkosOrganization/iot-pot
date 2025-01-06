import './style.css';

const init = () => {
  console.log('Configuration app init!');
  let statusInterval = 0;
  let statusIntervalTime = 5000;
  const connectionStatusCircle = document.getElementById(
    'connectionStatusCircle',
  )!;
  const connectionStatusSpan = document.getElementById('connectionStatusSpan')!;
  const ipAddressP = document.getElementById('ipAddress')!;
  const gatewayP = document.getElementById('gateway')!;
  const deviceIdSpan = document.getElementById('deviceId')!;
  const postForm = document.getElementById('postForm')! as HTMLFormElement;
  const tabLinks = document.querySelectorAll('.tabSelector a')!;
  const rangeInputs = document.querySelectorAll("input[type='range']")!;

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
            responseP.textContent =
              'Tiedot tallennettu, käynnistä laite uudelleen.';
          } else {
            responseP.textContent = 'Tietojen tallennus epäonnistui';
          }
        } else {
          responseP.textContent = `Virhe tietojen lähetyksessä: ${response.status}`;
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
    rangeInputs.forEach((i) => {
      i.addEventListener('input', (e) => {
        const el = e.target as HTMLInputElement;
        const elId = el.id;
        const valueEl = document.querySelector(
          `#${el.id}Value`,
        ) as HTMLSpanElement;
        console.log(el.value);
        valueEl.textContent = el.value;
      });
    });
  };

  const getConnectionStatus = async () => {
    if (!statusInterval)
      statusInterval = window.setInterval(
        getConnectionStatus,
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
        const gateway = result['gateway'];
        switch (statusCode) {
          case 3:
            console.log('Online', result, statusCode, ip);
            connectionStatusCircle.classList.add('greenBg');
            connectionStatusCircle.classList.remove('yellowBg');
            connectionStatusCircle.classList.remove('redBg');
            connectionStatusSpan.textContent = 'Connected';
            ipAddressP.textContent = ip;
            gatewayP.textContent = gateway;
            break;
          case 2:
            console.log('Scanning', result, statusCode, ip);
            connectionStatusCircle.classList.remove('greenBg');
            connectionStatusCircle.classList.add('yellowBg');
            connectionStatusCircle.classList.remove('redBg');
            connectionStatusSpan.textContent = 'Connecting';
            ipAddressP.textContent = '...';
            gatewayP.textContent = '...';
            break;
          default:
            console.log('Offline', result, statusCode, ip);
            connectionStatusCircle.classList.remove('greenBg');
            connectionStatusCircle.classList.add('yellowBg');
            connectionStatusCircle.classList.remove('redBg');
            connectionStatusSpan.textContent = 'Offline';
            ipAddressP.textContent = '-';
            gatewayP.textContent = '-';
            break;
        }
      } else {
        connectionStatusCircle.classList.remove('greenBg');
        connectionStatusCircle.classList.remove('yellowBg');
        connectionStatusCircle.classList.add('redBg');
        connectionStatusSpan.textContent = 'Offline';
        ipAddressP.textContent = '-';
        gatewayP.textContent = '-';
      }
    } catch (error) {
      connectionStatusCircle.classList.remove('greenBg');
      connectionStatusCircle.classList.remove('yellowBg');
      connectionStatusCircle.classList.add('redBg');
      connectionStatusSpan.textContent = 'Offline';
      ipAddressP.textContent = '-';
      gatewayP.textContent = '-';
    }
    statusInterval = window.setInterval(
      getConnectionStatus,
      statusIntervalTime,
    );
  };

  const getDeviceId = async () => {
    try {
      const response = await fetch('/device-id', {
        method: 'GET',
      });
      if (response.ok) {
        const result = await response.json();
        const res = result['device-id'];
        deviceIdSpan.textContent = res;
      } else {
        deviceIdSpan.textContent = '...';
      }
    } catch (error) {
      deviceIdSpan.textContent = '...';
    }
  };

  addEventListeners();
  getDeviceId();
  getConnectionStatus();
};
document.addEventListener('DOMContentLoaded', init);
