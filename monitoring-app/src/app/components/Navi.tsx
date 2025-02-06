"use client";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";
import styles from "./Navi.module.css";
import Link from "next/link";
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
  const { user } = useUser();
  const u = user as User;
  console.log(user);
  return (
    <nav className={styles.navi}>
      <Logo />
      <ul className={styles.deviceNavi}>
        {u?.db.devices.map((d, i) => {
          return (
            <li key={`deviceMenuItem_${i}`} className={styles.deviceNaviItem}>
              <Link href={`/dashboard/device/${d.deviceId}`}>{d.title}</Link>
            </li>
          );
        })}
      </ul>
      <LogoutButton />
    </nav>
  );
};
