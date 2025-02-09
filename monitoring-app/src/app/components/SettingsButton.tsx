import Link from "next/link";
import styles from "./SettingsButton.module.css";
import { GearIcon } from "./GearIcon";
export const SettingsButton = () => {
  return (
    <button className={styles.settingsBtn}>
      <Link href="/dashboard/settings">
        <GearIcon />{" "}
      </Link>
    </button>
  );
};
