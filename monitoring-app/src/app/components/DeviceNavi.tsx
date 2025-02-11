"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./DeviceNavi.module.css";
type DeviceNaviProps = {
  deviceId: string;
};
export const DeviceNavi = ({ deviceId }: DeviceNaviProps) => {
  const pathname = usePathname();
  return (
    <ul className={styles.container}>
      <li className={styles.listItem}>
        <Link
          href={`/dashboard/device/${deviceId}`}
          className={`${
            pathname === `/dashboard/device/${deviceId}` ? styles.active : ""
          } ${styles.link}`}
        >
          REAL-TIME
        </Link>
      </li>
      <li className={styles.listItem}>
        <Link
          href={`/dashboard/device/${deviceId}/history`}
          className={`${
            pathname.includes(`/dashboard/device/${deviceId}/history`)
              ? styles.active
              : ""
          } ${styles.link}`}
        >
          HISTORY
        </Link>
      </li>
    </ul>
  );
};
