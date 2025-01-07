import './style.css';

const init = () => {
  console.log('Configuration app init!');
  let statusInterval = 0;
  let statusIntervalTime = 5000;
  const connectionStatusCircle = document.getElementById(
    'connectionStatusCircle',
  )! as HTMLSpanElement;
  const connectionStatusSpan = document.getElementById(
    'connectionStatusSpan',
  )! as HTMLSpanElement;
  const ipAddressP = document.getElementById(
    'ipAddress',
  )! as HTMLParagraphElement;
  const gatewayP = document.getElementById('gateway')! as HTMLParagraphElement;
  const ssidP = document.getElementById('ssid')! as HTMLParagraphElement;
  const deviceIdSpan = document.getElementById('deviceId')! as HTMLSpanElement;
  const connectionForm = document.getElementById(
    'connectionForm',
  )! as HTMLFormElement;
  const contactInfoForm = document.getElementById(
    'contactInfoForm',
  )! as HTMLFormElement;
  const wateringAmountForm = document.getElementById(
    'wateringAmountForm',
  )! as HTMLFormElement;
  const wateringThresholdForm = document.getElementById(
    'wateringThresholdForm',
  )! as HTMLFormElement;
  const tabLinks = document.querySelectorAll('.tabSelector a')!;
  const rangeInputs = document.querySelectorAll("input[type='range']")!;
  const wateringThresholdInput = document.getElementById(
    'wateringThreshold',
  )! as HTMLInputElement;
  const wateringThresholdSpan = document.getElementById(
    'wateringThreshold',
  )! as HTMLSpanElement;

  const wateringAmountInput = document.getElementById(
    'wateringAmount',
  )! as HTMLInputElement;
  const wateringAmountSpan = document.getElementById(
    'wateringAmountValue',
  )! as HTMLSpanElement;

  const emailInput = document.getElementById('email')! as HTMLInputElement;

  const addEventListeners = () => {
    connectionForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const ssidInputEl = document.getElementById('ssid') as HTMLInputElement;
      const ssid = ssidInputEl.value;
      const pwdInputEl = document.getElementById('pwd') as HTMLInputElement;
      const pwd = pwdInputEl.value as string;
      const responseP = document.getElementById(
        'connectionFormResponse',
      ) as HTMLParagraphElement;
      try {
        const response = await fetch('/router-credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ ssid, pwd }),
        });

        if (response.ok) {
          const result = await response.json(); // Parse JSON response
          if (result.success === '1') {
            responseP.textContent = 'Saved';
          } else {
            responseP.textContent = 'Failed';
          }
        } else {
          responseP.textContent = `Error: ${response.status}`;
        }
      } catch (error) {
        if (error instanceof Error)
          responseP.innerHTML = `<pre>Error: ${error?.message}</pre>`;
      }
      responseP.classList.remove('hidden');
      connectionForm.reset();
    });
    contactInfoForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const emailInputEl = document.getElementById('email') as HTMLInputElement;
      const email = emailInputEl.value;

      const responseP = document.getElementById(
        'emailResponse',
      ) as HTMLParagraphElement;
      try {
        const response = await fetch('/email-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ email }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success === '1') {
            responseP.textContent = 'Saved';
          } else {
            responseP.textContent = 'Failed';
          }
        } else {
          responseP.textContent = `Error: ${response.status}`;
        }
      } catch (error) {
        if (error instanceof Error)
          responseP.innerHTML = `<pre>Error: ${error?.message}</pre>`;
      }
      responseP.classList.remove('hidden');
      contactInfoForm.reset();
    });
    wateringThresholdForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const wateringThresholdInputEl = document.getElementById(
        'email',
      ) as HTMLInputElement;
      const wt = wateringThresholdInputEl.value;

      const responseP = document.getElementById(
        'emailResponse',
      ) as HTMLParagraphElement;
      try {
        const response = await fetch('/watering-threshold', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ wt }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success === '1') {
            responseP.textContent = 'Saved';
          } else {
            responseP.textContent = 'Failed';
          }
        } else {
          responseP.textContent = `Error: ${response.status}`;
        }
      } catch (error) {
        if (error instanceof Error)
          responseP.innerHTML = `<pre>Error: ${error?.message}</pre>`;
      }
      responseP.classList.remove('hidden');
      wateringThresholdForm.reset();
    });
    wateringAmountForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const wateringAmountInputEl = document.getElementById(
        'email',
      ) as HTMLInputElement;
      const wa = wateringAmountInputEl.value;

      const responseP = document.getElementById(
        'emailResponse',
      ) as HTMLParagraphElement;
      try {
        const response = await fetch('/watering-threshold', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ wa }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success === '1') {
            responseP.textContent = 'Saved';
          } else {
            responseP.textContent = 'Failed';
          }
        } else {
          responseP.textContent = `Error: ${response.status}`;
        }
      } catch (error) {
        if (error instanceof Error)
          responseP.innerHTML = `<pre>Error: ${error?.message}</pre>`;
      }
      responseP.classList.remove('hidden');
      wateringAmountForm.reset();
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
        const ssid = result['ssid'];
        switch (statusCode) {
          case 3:
            console.log('Online', result, statusCode, ip);
            connectionStatusCircle.classList.add('greenBg');
            connectionStatusCircle.classList.remove('yellowBg');
            connectionStatusCircle.classList.remove('redBg');
            connectionStatusSpan.textContent = 'Connected';
            ipAddressP.textContent = ip;
            gatewayP.textContent = gateway;
            ssidP.textContent = ssid;
            break;
          case 2:
            console.log('Scanning', result, statusCode, ip);
            connectionStatusCircle.classList.remove('greenBg');
            connectionStatusCircle.classList.add('yellowBg');
            connectionStatusCircle.classList.remove('redBg');
            connectionStatusSpan.textContent = 'Connecting';
            ipAddressP.textContent = '...';
            gatewayP.textContent = '...';
            ssidP.textContent = '...';
            break;
          default:
            console.log('Offline', result, statusCode, ip);
            connectionStatusCircle.classList.remove('greenBg');
            connectionStatusCircle.classList.add('yellowBg');
            connectionStatusCircle.classList.remove('redBg');
            connectionStatusSpan.textContent = 'Offline';
            ipAddressP.textContent = '-';
            gatewayP.textContent = '-';
            ssidP.textContent = '-';
            break;
        }
      } else {
        connectionStatusCircle.classList.remove('greenBg');
        connectionStatusCircle.classList.remove('yellowBg');
        connectionStatusCircle.classList.add('redBg');
        connectionStatusSpan.textContent = 'Offline';
        ipAddressP.textContent = '-';
        gatewayP.textContent = '-';
        ssidP.textContent = '-';
      }
    } catch (error) {
      connectionStatusCircle.classList.remove('greenBg');
      connectionStatusCircle.classList.remove('yellowBg');
      connectionStatusCircle.classList.add('redBg');
      connectionStatusSpan.textContent = 'Offline';
      ipAddressP.textContent = '-';
      gatewayP.textContent = '-';
      ssidP.textContent = '-';
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

  const getWateringAmount = async () => {
    try {
      const response = await fetch('/watering-amount', {
        method: 'GET',
      });
      if (response.ok) {
        const result = await response.json();
        const res = result['watering-amount'];
        console.log(res);
        wateringAmountInput.value = res;
        wateringAmountSpan.textContent = res;
      } else {
      }
    } catch (error) {}
  };

  const getWateringThreshold = async () => {
    try {
      const response = await fetch('/watering-threshold', {
        method: 'GET',
      });
      if (response.ok) {
        const result = await response.json();
        const res = result['watering-threshold'];
        console.log(res);
        wateringThresholdInput.value = res;
        wateringThresholdSpan.textContent = res;
      } else {
      }
    } catch (error) {}
  };

  const getEmailAddress = async () => {
    try {
      const response = await fetch('/email-address', {
        method: 'GET',
      });
      if (response.ok) {
        const result = await response.json();
        const res = result['email'];
        console.log(res);
        emailInput.value = res;
      } else {
      }
    } catch (error) {}
  };

  const getNotificationTriggers = async () => {
    try {
      const response = await fetch('/notification-triggers', {
        method: 'GET',
      });
      if (response.ok) {
        const result = await response.json();
        const res = result['notification-triggers'];
        console.log(res);
      } else {
      }
    } catch (error) {}
  };

  addEventListeners();
  getDeviceId();
  getConnectionStatus();
  getWateringAmount();
  getWateringThreshold();
  getEmailAddress();
  getNotificationTriggers();
};
document.addEventListener('DOMContentLoaded', init);
