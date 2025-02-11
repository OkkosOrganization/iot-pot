"use client";
import { useMqttContext } from "../contexts/mqttContext";
import { SensorCard } from "./SensorCard";

export const DevicePageContent = () => {
  const { airTemperature, airHumidity } = useMqttContext();
  return (
    <>
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
        value={0}
        unit=""
      />
    </>
  );
};
