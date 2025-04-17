import { getSession } from "@auth0/nextjs-auth0";
import { getDevice } from "../../../../../db/db";
import styles from "./page.module.css";
import { DeviceNavi } from "@/app/components/DeviceNavi";
import { DevicePageContent } from "@/app/components/DevicePageContent";
import { MqttContextProvider } from "@/contexts/mqttContext";

export default async function Page({
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
    <MqttContextProvider
      initialValues={{
        deviceId: device[0].deviceId.toString(),
        airTemperature: 0,
        airHumidity: 0,
        soilMoisture: 0,
        soilPh: 0,
        soilTemperature: 0,
        luminosity: 0,
        waterOverflow: 0,
        waterLevel: 0,
      }}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>{device[0].title}</h1>
        <div className={styles.naviContainer}>
          <DeviceNavi deviceId={id} />
        </div>
        <div className={styles.content}>
          <DevicePageContent deviceId={id} />
        </div>
      </div>
    </MqttContextProvider>
  );
}
