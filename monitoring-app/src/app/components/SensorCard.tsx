import { AirHumidityIcon } from "./icons/AirHumidityIcon";
import { AirTemperatureIcon } from "./icons/AirTemperatureIcon";
import { LuminosityIcon } from "./icons/LuminosityIcon";
import { WaterOverFlowIcon } from "./icons/WaterOverFlowIcon";
import { SoilMoistureIcon } from "./icons/SoilMoistureIcon";
import { WaterLevelIcon } from "./icons/WaterLevelIcon";
import styles from "./SensorCard.module.css";
type SensorTypes =
  | "soilMoisture"
  | "soilTemperature"
  | "soilPh"
  | "airTemperature"
  | "airHumidity"
  | "luminosity"
  | "waterLevel"
  | "waterOverflow";
type SensorCardProps = {
  type: SensorTypes;
  title: string;
  value: number;
  unit: string;
};
export const SensorCard = ({ type, title, value, unit }: SensorCardProps) => {
  return (
    <div className={`${styles.container}`}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.iconContainer}>
          {(() => {
            switch (type) {
              case "soilMoisture":
                return <SoilMoistureIcon />;
              case "waterLevel":
                return <WaterLevelIcon />;
              case "luminosity":
                return <LuminosityIcon />;
              case "airTemperature":
                return <AirTemperatureIcon />;
              case "airHumidity":
                return <AirHumidityIcon />;
              case "waterOverflow":
                return <WaterOverFlowIcon />;
              default:
                return null;
            }
          })()}
        </div>
        <h4 className={styles.valueAndUnit}>
          <span className={styles.value}>{value}</span>
          <span className={styles.unit}>{unit}</span>
        </h4>
      </div>
    </div>
  );
};
