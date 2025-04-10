"use client";
import { SensorValues } from "@/types";
import mqtt, { MqttClient } from "mqtt";
import { createContext, useContext, useEffect, useState } from "react";

type MqttContextType = {
  client: MqttClient | null;
  deviceId: string;
} & SensorValues;

type MqttContextProviderProps = {
  children: React.ReactNode;
  initialValues: SensorValues;
};

export const defaultValues: MqttContextType = {
  client: null,
  deviceId: "",
  airTemperature: 0,
  airHumidity: 0,
  soilMoisture: 0,
  soilTemperature: 0,
  soilPh: 0,
  luminosity: 0,
  waterLevel: 0,
  waterOverflow: 0,
};

const MqttContext = createContext<MqttContextType>(defaultValues);

export const MqttContextProvider = ({
  children,
  initialValues,
}: MqttContextProviderProps) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [airTemperature, setAirTemperature] = useState(
    initialValues.airTemperature
  );
  const [airHumidity, setAirHumidity] = useState(initialValues.airHumidity);
  const [soilMoisture, setSoilMoisture] = useState(initialValues.soilMoisture);
  const [soilPh, setSoilPh] = useState(initialValues.soilPh);
  const [soilTemperature, setSoilTemperature] = useState(
    initialValues.soilTemperature
  );
  const [luminosity, setLuminosity] = useState(initialValues.luminosity);
  const [waterLevel, setWaterLevel] = useState(initialValues.waterLevel);
  const [waterOverflow, setWaterOverflow] = useState(
    initialValues.waterOverflow
  );

  const deviceId = initialValues.deviceId.toUpperCase();

  useEffect(() => {
    const mqttClient = mqtt.connect(
      process.env.NEXT_PUBLIC_MQTT_URL as string,
      {
        clientId: `web-${deviceId}`,
        username: process.env.NEXT_PUBLIC_MQTT_USER,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
        clean: false,
      }
    );

    setClient(mqttClient);

    mqttClient.on("connect", () => {
      console.log("MQTT connected");

      const topics = [
        "airHumidity",
        "airTemperature",
        "soilMoisture",
        "soilPh",
        "soilTemperature",
        "luminosity",
        "waterLevel",
        "waterOverflow",
      ];

      topics.forEach((key) => {
        const topic = `/device/${deviceId}/${key}/`;
        mqttClient.subscribe(topic, () => {
          console.log(`Subscribed to: ${topic}`);
        });
      });
    });

    mqttClient.on("message", (topic, message) => {
      const value = parseInt(message.toString());

      if (topic.endsWith("/airHumidity/")) setAirHumidity(value);
      else if (topic.endsWith("/airTemperature/")) setAirTemperature(value);
      else if (topic.endsWith("/soilMoisture/")) setSoilMoisture(value);
      else if (topic.endsWith("/soilPh/")) setSoilPh(value);
      else if (topic.endsWith("/soilTemperature/")) setSoilTemperature(value);
      else if (topic.endsWith("/luminosity/")) setLuminosity(value);
      else if (topic.endsWith("/waterLevel/")) setWaterLevel(value);
      else if (topic.endsWith("/waterOverflow/")) setWaterOverflow(value);
    });

    mqttClient.on("close", () => {
      console.log("MQTT connection closed");
    });

    return () => {
      mqttClient.end(true, () => {
        console.log("Disconnected MQTT on unmount");
      });
    };
  }, [deviceId]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (client?.connected) {
        client.end(true);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [client]);

  return (
    <MqttContext.Provider
      value={{
        client,
        deviceId,
        airTemperature,
        airHumidity,
        soilMoisture,
        soilPh,
        soilTemperature,
        luminosity,
        waterLevel,
        waterOverflow,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export const useMqttContext = () => {
  return useContext(MqttContext);
};
