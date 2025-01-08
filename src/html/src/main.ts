import './style.css';

const init = () => {
  console.log('Configuration app init!');
  let statusInterval = 0;
  let statusIntervalTime = 10000;
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
  const notificationTriggersForm = document.getElementById(
    'notificationTriggersForm',
  )! as HTMLFormElement;
  const tabLinks = document.querySelectorAll('.tabSelector a')!;
  const rangeInputs = document.querySelectorAll("input[type='range']")!;
  const wateringThresholdInput = document.getElementById(
    'wateringThreshold',
  )! as HTMLInputElement;
  const wateringThresholdSpan = document.getElementById(
    'wateringThresholdValue',
  )! as HTMLSpanElement;
  const wateringAmountInput = document.getElementById(
    'wateringAmount',
  )! as HTMLInputElement;
  const wateringAmountSpan = document.getElementById(
    'wateringAmountValue',
  )! as HTMLSpanElement;
  const soilMoistureCheckbox = document.getElementById(
    'notification-soil-moisture-threshold',
  ) as HTMLInputElement;
  const waterTankCheckbox = document.getElementById(
    'notification-water-tank-empty',
  ) as HTMLInputElement;
  const waterOverflowCheckbox = document.getElementById(
    'notification-water-overflow',
  ) as HTMLInputElement;

  const emailInput = document.getElementById('email')! as HTMLInputElement;

  // SETS UP ALL EVENT LISTENERS
  const addEventListeners = () => {
    connectionForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const ssidInputEl = document.getElementById(
        'ssidInput',
      ) as HTMLInputElement;
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
    });
    notificationTriggersForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const responseP = document.getElementById(
        'notificationTriggersResponse',
      ) as HTMLParagraphElement;

      console.log(
        soilMoistureCheckbox.checked,
        waterTankCheckbox.checked,
        waterOverflowCheckbox.checked,
      );
      try {
        const response = await fetch('/notification-triggers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'notification-soil-moisture-threshold': soilMoistureCheckbox.checked
              ? 'true'
              : 'false',
            'notification-water-tank-empty': waterTankCheckbox.checked
              ? 'true'
              : 'false',
            'notification-water-overflow': waterOverflowCheckbox.checked
              ? 'true'
              : 'false',
          }),
        });
        console.log(response);
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
    });
    wateringThresholdForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const wateringThresholdInputEl = document.getElementById(
        'wateringThreshold',
      ) as HTMLInputElement;
      const wt = wateringThresholdInputEl.value;
      const responseP = document.getElementById(
        'wateringThresholdFormResponse',
      ) as HTMLParagraphElement;
      try {
        const response = await fetch('/watering-threshold', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ 'watering-threshold': wt }),
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
    });
    wateringAmountForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const wateringAmountInputEl = document.getElementById(
        'wateringAmount',
      ) as HTMLInputElement;
      const wa = wateringAmountInputEl.value;

      const responseP = document.getElementById(
        'wateringAmountFormResponse',
      ) as HTMLParagraphElement;
      try {
        const response = await fetch('/watering-amount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ 'watering-amount': wa }),
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

  // API CALLS
  type ConnectionStatusResponse = {
    'connection-status': string;
    ip: string;
    gateway: string;
    ssid: string;
  };
  const getConnectionStatus = async (): Promise<void> => {
    if (!statusInterval)
      statusInterval = window.setInterval(
        getConnectionStatus,
        statusIntervalTime,
      );
    clearInterval(statusInterval);
    const response = await fetch('/connection-status', {
      method: 'GET',
    });
    if (response.ok) {
      const result: ConnectionStatusResponse = await response.json();
      const statusCode = parseInt(result['connection-status']);
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
          connectionStatusCircle.classList.remove('yellowBg');
          connectionStatusCircle.classList.add('redBg');
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

    statusInterval = window.setInterval(
      getConnectionStatus,
      statusIntervalTime,
    );
  };

  type DeviceIdResponse = {
    'device-id': string;
  };
  const getDeviceId = async (): Promise<void> => {
    const response = await fetch('/device-id', {
      method: 'GET',
    });
    if (response.ok) {
      const result: DeviceIdResponse = await response.json();
      const res = result['device-id'];
      deviceIdSpan.textContent = res;
    } else {
      deviceIdSpan.textContent = '...';
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  };

  type WateringAmountResponse = {
    'watering-amount': string;
  };
  const getWateringAmount = async (): Promise<void> => {
    const url = '/watering-amount';
    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.ok) {
      const result: WateringAmountResponse = await response.json();
      const wa = result['watering-amount'];
      console.log('watering-amount:', wa);
      if (wa === 'undefined' || wa === '') {
        const defaultValue = wateringAmountInput.getAttribute('data-default')!;
        wateringAmountInput.value = defaultValue;
        wateringAmountSpan.textContent = defaultValue;
      } else {
        wateringAmountInput.value = wa;
        wateringAmountSpan.textContent = wa;
      }
    } else {
      console.log('Fetch failed', url);
    }
  };

  type WateringThresholdResponse = {
    'watering-threshold': string;
  };
  const getWateringThreshold = async (): Promise<void> => {
    const response = await fetch('/watering-threshold', {
      method: 'GET',
    });
    if (response.ok) {
      const result: WateringThresholdResponse = await response.json();
      const wt = result['watering-threshold'];

      console.log('watering-threshold:', wt);
      if (wt === 'undefined' || wt === '') {
        const defaultValue =
          wateringThresholdInput.getAttribute('data-default')!;
        wateringThresholdInput.value = defaultValue;
        wateringThresholdSpan.textContent = defaultValue;
      } else {
        wateringThresholdInput.value = wt;
        wateringThresholdSpan.textContent = wt;
      }
    } else {
    }
  };

  type EmailAddressResponse = {
    email: string;
  };
  const getEmailAddress = async (): Promise<void> => {
    const url = '/email-address';
    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.ok) {
      const result: EmailAddressResponse = await response.json();
      const email = result['email'];
      if (email !== 'undefined' && email !== '') emailInput.value = email;
      else emailInput.value = '';
      console.log(email, emailInput);
    } else {
      console.log('Fetch failed', url);
    }
  };

  type NotificationTriggersResponse = {
    'notification-soil-moisture-threshold': string;
    'notification-water-tank-empty': string;
    'notification-water-overflow': string;
  };
  const getNotificationTriggers = async (): Promise<void> => {
    const url = '/notification-triggers';
    const response = await fetch(url, {
      method: 'GET',
    });
    if (response.ok) {
      const result: NotificationTriggersResponse = await response.json();
      const soilMoistureThresholdTrigger = Boolean(
        result['notification-soil-moisture-threshold'],
      );
      const waterTankEmptyTrigger = Boolean(
        result['notification-water-tank-empty'],
      );
      const waterOverflowTrigger = Boolean(
        result['notification-water-overflow'],
      );

      soilMoistureCheckbox.checked = soilMoistureThresholdTrigger;
      waterTankCheckbox.checked = waterTankEmptyTrigger;
      waterOverflowCheckbox.checked = waterOverflowTrigger;

      console.log(result);
    } else {
      console.log('Fetch failed', url);
    }
  };

  // GETS THE INITIAL VALUES FROM SERVER
  const getInitialValues = async () => {
    try {
      await getDeviceId();
      await getWateringAmount();
      await getWateringThreshold();
      await getEmailAddress();
      await getNotificationTriggers();
      await getConnectionStatus();
    } catch (error) {
      console.log(error);
    }
  };

  // START
  addEventListeners();
  getInitialValues();
};
document.addEventListener('DOMContentLoaded', init);
