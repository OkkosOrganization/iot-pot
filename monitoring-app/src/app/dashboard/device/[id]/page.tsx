import { getSession } from "@auth0/nextjs-auth0";
import { getDevice } from "../../../../../db/db";
import styles from "./page.module.css";
import { DeviceNavi } from "@/app/components/DeviceNavi";
import { SensorCard } from "@/app/components/SensorCard";

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
    <div className={styles.container}>
      <h1 className={styles.title}>{device[0].title}</h1>
      <div className={styles.naviContainer}>
        <DeviceNavi deviceId={id} />
      </div>
      <div className={styles.content}>
        <SensorCard
          type="soilMoisture"
          title="Soil Moisture"
          value={33}
          unit="%"
        />
        <SensorCard type="waterLevel" title="Water Level" value={65} unit="%" />
        <SensorCard
          type="luminosity"
          title="Luminosity"
          value={1293}
          unit="LUX"
        />
        <SensorCard
          type="airTemperature"
          title="Air Temperature"
          value={23}
          unit="°C"
        />
        <SensorCard
          type="airHumidity"
          title="Air Humidity"
          value={789}
          unit="%"
        />
        <SensorCard
          type="waterOverflow"
          title="Water Overflow"
          value={0}
          unit=""
        />
      </div>
    </div>
  );
}
