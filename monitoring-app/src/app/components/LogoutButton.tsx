import Link from "next/link";
import styles from "./LogoutButton.module.css";
export const LogoutButton = () => {
  return (
    <button className={styles.logoutBtn}>
      <Link href="/api/auth/logout">LOGOUT</Link>
    </button>
  );
};
