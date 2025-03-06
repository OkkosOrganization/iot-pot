"use client";
import styles from "./UserInfo.module.css";
import { Spinner } from "./Spinner";
import Image from "next/image";
import Link from "next/link";
import { Device } from "../../types";
import { useExtendedUserContext } from "@/contexts/extendedUserContext";

export const UserInfo = () => {
  const { user, isLoading, setUser } = useExtendedUserContext();

  const confirmDelete = (deviceName: string, deviceId: string) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to remove "${deviceName}"?`
    );
    if (userConfirmed) deleteDevice(deviceId);
  };

  const deleteDevice = async (deviceId: string) => {
    console.log(`Removing device, ID: ${deviceId}`);

    try {
      const response = await fetch(`/api/device/unlink/${deviceId}/`, {
        method: "PATCH",
      });
      if (response.ok && user) {
        const updatedUser = { ...user };
        const updatedDevices = user?.db.devices.filter(
          (d: Device) => d.deviceId !== deviceId
        );
        updatedUser.db.devices = updatedDevices || [];
        setUser(updatedUser);
      } else {
        alert("An error occured");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occured");
    }
  };

  return (
    <div className={styles.container}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.profileImage}>
            {user && (
              <Image
                unoptimized
                src={user.picture as string}
                width={80}
                height={80}
                alt={user.nickname as string}
              />
            )}
          </div>
          <h2 className={styles.nickName}>{user?.nickname}</h2>

          {user?.db.devices && user.db.devices.length > 0 && (
            <>
              <h3 className={styles.devicesTitle}>Devices:</h3>
              <div className={styles.devicesContainer}>
                {user?.db?.devices?.map((d: Device, i: number) => {
                  return (
                    <div key={`device_${i}`} className={styles.device}>
                      <Link href={`/dashboard/device/${d.deviceId}`}>
                        <h3>{d.title}</h3>
                      </Link>
                      <button
                        className={`btn ${styles.removeBtn}`}
                        onClick={() => confirmDelete(d.title, d.deviceId)}
                      >
                        REMOVE
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
