"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "./UserInfo.module.css";
import { DbUser, Device } from "./Navi";
export const UserInfo = () => {
  const { user } = useUser();
  const userWitHDb = user as DbUser;

  function confirmDelete(deviceName: string, deviceId: string) {
    const userConfirmed = window.confirm(
      `Are you sure you want to remove "${deviceName}"?`
    );

    if (userConfirmed) {
      deleteDevice(deviceId);
    }
  }

  function deleteDevice(deviceId: string) {
    // Lähetä pyyntö palvelimelle tai suorita tarvittavat toimenpiteet
    console.log(`Device ID ${deviceId} removing...`);

    // Esimerkki: Fetch-pyyntö palvelimelle
    fetch(`/api/devices/${deviceId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Device removed");
        } else {
          alert("An error occured");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occured");
      });
  }

  return (
    <div>
      <div className={styles.container}>
        <p>{JSON.stringify(user, null, 5)}</p>
      </div>
      <div>
        <h2>Devices:</h2>
        {userWitHDb?.db?.devices?.map((d: Device, i: number) => {
          return (
            <div key={`device_${i}`}>
              <h3>{d.title}</h3>
              <button
                className="btn"
                onClick={() => confirmDelete(d.title, d.deviceId)}
              >
                REMOVE DEVICE
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
