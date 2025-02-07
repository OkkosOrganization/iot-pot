"use client";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import styles from "./Navi.module.css";
import Link from "next/link";
import { PlantIcon } from "./PlantIcon";
import { usePathname } from "next/navigation";
import { PlusIcon } from "./PlusIcon";
import { useEffect, useState } from "react";
import { AddDeviceDialog } from "./AddDeviceDialog";
export type Device = {
  id: number;
  deviceId: string;
  userId: number;
  title: string;
};
type UserWithDb = {
  db: {
    id: number;
    auth0Id: string;
    devices: Device[];
  };
};

type User = UserProfile & UserWithDb;
export const Navi = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const { user } = useUser();
  const u = user as User;
  const pathname = usePathname();

  useEffect(() => {
    setDevices(u?.db.devices);
  }, [u]);

  return (
    <>
      <nav className={styles.navi}>
        <div className={styles.logoContainer}>
          <Link href="/dashboard">
            <Logo />
          </Link>
          <h2 className={styles.userName}>{u?.name}</h2>
        </div>
        <ul className={styles.deviceNavi}>
          {devices?.map((d, i) => {
            const isActiveItem = pathname.includes(
              `/dashboard/device/${d.deviceId}`
            );

            return (
              <li
                key={`deviceMenuItem_${i}`}
                className={`${styles.deviceNaviItem} ${
                  isActiveItem ? styles.active : ""
                }`}
              >
                <Link
                  href={`/dashboard/device/${d.deviceId}`}
                  className={`${styles.deviceNaviItemLink} `}
                >
                  <div className={`${styles.naviItemIcon} `}>
                    <PlantIcon />
                  </div>
                  <span className={styles.naviItemTitle}>{d.title}</span>
                </Link>
              </li>
            );
          })}
          <li
            className={styles.addDeviceBtn}
            onClick={() => setShowDialog(true)}
          >
            <PlusIcon />
          </li>
        </ul>
        <LogoutButton />
      </nav>
      <AddDeviceDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        setDevices={setDevices}
        userId={u?.db.id}
      />
    </>
  );
};
