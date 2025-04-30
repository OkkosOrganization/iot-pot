"use client";
import { useMqttContext } from "@/contexts/mqttContext";
import { SensorCard } from "./SensorCard";
import { NoteForm } from "./NoteForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import styles from "./DevicePageContent.module.css";
import { SensorInfoDialog } from "./SensorInfoDialog";

type DevicePageContentProps = {
  deviceId: string;
};
export const DevicePageContent = ({ deviceId }: DevicePageContentProps) => {
  const {
    airTemperature,
    airHumidity,
    soilMoisture,
    soilPh,
    soilTemperature,
    luminosity,
    waterLevel,
    waterOverflow,
  } = useMqttContext();

  const [showDialog, setShowDialog] = useState<boolean>(false);

  const showSensorInfoDialog = () => {
    setShowDialog(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container}>
        <SensorCard
          type="soilMoisture"
          title="Soil Moisture"
          value={soilMoisture as number}
          unit="%"
        />
        <SensorCard
          type="soilPh"
          title="Soil PH"
          value={((soilPh as number) / 10).toFixed(1)}
          unit=""
        />
        <SensorCard
          type="soilTemperature"
          title="Soil Temperature"
          value={soilTemperature as number}
          unit="°C"
        />
        <SensorCard
          type="waterLevel"
          title="Water Level"
          value={waterLevel}
          unit="%"
        />
        <SensorCard
          type="luminosity"
          title="Luminosity"
          value={luminosity as number}
          unit="LUX"
        />
        <SensorCard
          type="airTemperature"
          title="Air Temperature"
          value={airTemperature as number}
          unit="°C"
        />
        <SensorCard
          type="airHumidity"
          title="Air Humidity"
          value={airHumidity as number}
          unit="%"
        />
        <SensorCard
          type="waterOverflow"
          title="Water Overflow"
          value={waterOverflow}
          unit=""
        />
        <button
          className={`btn ${styles.sensorInfoDialogBtn}`}
          onClick={showSensorInfoDialog}
        >
          <span>i</span>
        </button>
      </div>
      <NoteForm deviceId={deviceId} />
      <SensorInfoDialog showDialog={showDialog} setShowDialog={setShowDialog} />
    </LocalizationProvider>
  );
};
