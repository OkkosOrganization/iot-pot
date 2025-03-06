"use client";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import styles from "./Navi.module.css";
import Link from "next/link";
import { PlantIcon } from "./PlantIcon";
import { usePathname } from "next/navigation";
import { PlusIcon } from "./icons/PlusIcon";
import { useState } from "react";
import { AddDeviceDialog } from "./AddDeviceDialog";
import { SettingsButton } from "./SettingsButton";
import { useExtendedUserContext } from "../contexts/extendedUserContext";
export type Device = {
  id: number;
  deviceId: string;
  userId: number;
  title: string;
};
export type DbUser = {
  db: {
    id: number;
    auth0Id: string;
    devices: Device[];
  };
};
export type User = UserProfile & DbUser;
export const Navi = () => {
  const { user, isLoading } = useExtendedUserContext();
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <>
      <nav className={styles.navi}>
        <div className={styles.logoContainer}>
          <Link href="/dashboard">
            <Logo />
          </Link>
          <h2 className={styles.userName}>{user?.name}</h2>
        </div>
        <ul className={styles.deviceNavi}>
          {user?.db.devices?.map((d, i) => {
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
            id="addDeviceBtn"
            onClick={() => setShowDialog(true)}
          >
            <PlusIcon />
          </li>
        </ul>
        <div className={styles.footer}>
          <SettingsButton />
          <LogoutButton />
        </div>
      </nav>
      <AddDeviceDialog showDialog={showDialog} setShowDialog={setShowDialog} />
    </>
  );
};
