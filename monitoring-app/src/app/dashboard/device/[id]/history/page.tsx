import { getSession } from "@auth0/nextjs-auth0";
import { getDevice } from "../../../../../../db/db";
import { DeviceNavi } from "../../../../components/DeviceNavi";
import { DeviceHistoryPageContent } from "../../../../components/DeviceHistoryPageContent";
import styles from "./page.module.css";
import { Device } from "@/types";

export default async function DeviceHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const id = (await params).id;
  const device = await getDevice(id);

  if (!session) return <h1>No session</h1>;

  if (!device.length) return <h1>No device found</h1>;

  // CHECK THAT CURRENT USER OWNS THE DEVICE
  if (device[0].userId !== session.user?.db.id)
    return <h1>Not authorized to access this device</h1>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{device[0].title}</h1>
      <div className={styles.naviContainer}>
        <DeviceNavi deviceId={id} />
      </div>
      <div className={styles.content}>
        <DeviceHistoryPageContent device={device[0] as Device} />
      </div>
    </div>
  );
}
