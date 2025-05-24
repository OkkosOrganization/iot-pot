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
    <tr key={data?.id} className={styles.container}>
      <td className={styles.amount}>
        <span className={styles.title}>{data.amount}</span>
      </td>
      <td className={styles.date}>
        <span>
          {d.format("DD.MM.YYYY")} - {d.format("HH:mm")}
        </span>
      </td>
    </tr>
  );
};
