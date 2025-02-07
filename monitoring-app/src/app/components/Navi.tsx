"use client";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import styles from "./Navi.module.css";
import Link from "next/link";
import { PlantIcon } from "./PlantIcon";
import { usePathname } from "next/navigation";
import { PlusIcon } from "./PlusIcon";
import { useState } from "react";
import { AddDeviceDialog } from "./AddDeviceDialog";
type Device = {
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
  const { user } = useUser();
  const pathname = usePathname();
  const u = user as User;
  return (
    <>
      <nav className={styles.navi}>
        <Logo />
        <ul className={styles.deviceNavi}>
          {u?.db.devices.map((d, i) => {
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
      <AddDeviceDialog showDialog={showDialog} setShowDialog={setShowDialog} />
    </>
  );
};
