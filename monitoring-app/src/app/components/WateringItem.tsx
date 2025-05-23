import { Watering } from "@/types";
import dayjs from "dayjs";
import styles from "./WateringItem.module.css";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

type WateringItemProps = {
  data: Watering;
};
export const WateringItem = ({ data }: WateringItemProps) => {
  const d = dayjs.utc(data.timestamp).tz("Europe/Helsinki");

  return (
    <div key={data?.id} className={styles.container}>
      <div className={styles.top}>
        <h3 className={styles.title}>Watering amount: {data.amount}</h3>
        <div className={styles.date}>
          <span>{d.format("DD.MM.YYYY")}</span>
          <span>{d.format("HH:mm")}</span>
        </div>
      </div>
    </div>
  );
};
