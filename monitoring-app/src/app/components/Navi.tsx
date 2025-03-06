"use client";
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
import { Device } from "../../types";
import { useExtendedUserContext } from "@/contexts/extendedUserContext";

export const Navi = () => {
  const { user } = useExtendedUserContext();
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
          {user?.db.devices?.map((d: Device, i: number) => {
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
