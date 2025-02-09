import Link from "next/link";
import styles from "./LogoutButton.module.css";
import { LogoutIcon } from "./LogoutIcon";
export const LogoutButton = () => {
  return (
    <button className={styles.logoutBtn}>
      <Link href="/api/auth/logout" prefetch={false}>
        <LogoutIcon />{" "}
      </Link>
    </button>
  );
};
