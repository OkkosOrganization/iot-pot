"use client";
import { useMqttContext } from "@/contexts/mqttContext";
import { SensorCard } from "./SensorCard";

export const DevicePageContent = () => {
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
  return (
    <>
      <SensorCard
        type="soilMoisture"
        title="Soil Moisture"
        value={soilMoisture as number}
        unit="%"
      />
      <SensorCard
        type="soilPh"
        title="Soil PH"
        value={soilPh as number}
        unit="%"
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
    </>
  );
};
