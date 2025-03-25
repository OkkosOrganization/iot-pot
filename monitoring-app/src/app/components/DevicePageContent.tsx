"use client";
import { useMqttContext } from "@/contexts/mqttContext";
import { SensorCard } from "./SensorCard";

export const DevicePageContent = () => {
  const {
    airTemperature,
    airHumidity,
    soilMoisture,
    soilPH,
    soilTemperature,
    luminosity,
    waterLevel,
    waterOverflow,
  } = useMqttContext();
  return (
    <>
      <SensorCard
        type="soilMoisture"
        title="Soil Moisture"
        value={soilMoisture as number}
        unit="%"
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
    </>
  );
};
