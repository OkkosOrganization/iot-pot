import { AddDeviceBtn } from "../components/AddDeviceButton";
import styles from "./page.module.css";
import { getSession } from "@auth0/nextjs-auth0";

export default async function DashboardPage() {
  const session = await getSession();
  const devices = session?.user.db.devices;

  return (
    <div className={styles.container}>
      {!devices.length ? <AddDeviceBtn /> : null}
    </div>
  );
}
