"use client";
import mqtt, { MqttClient } from "mqtt";
import { createContext, useContext, useEffect, useState } from "react";

type MqttContextType = {
  client: MqttClient | null;
  deviceId: string;
} & SensorValues;

export type SensorValues = {
  airTemperature?: number;
  airHumidity?: number;
  soilMoisture?: number;
  soilPH?: number;
  soilTemperature?: number;
  luminosity?: number;
  deviceId: string;
};
type MqttContextProviderProps = {
  children: React.ReactNode;
  initialValues: SensorValues;
};
export const defaultValues = {
  client: null,
  deviceId: "",
  airTemperature: 0,
  airHumidity: 0,
  soilMoisture: 0,
  soilTemperature: 0,
  soilPh: 0,
  luminosity: 0,
} as MqttContextType;

const MqttContext = createContext<MqttContextType>(defaultValues);

export const MqttContextProvider = ({
  children,
  initialValues,
}: MqttContextProviderProps) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [airTemperature, setAirTemperature] = useState<number | undefined>(
    initialValues.airTemperature
  );
  const [airHumidity, setAirHumidity] = useState(initialValues.airHumidity);
  const [soilMoisture, setSoilMoisture] = useState(initialValues.soilMoisture);
  const [soilPh, setSoilPh] = useState(initialValues.soilPH);
  const [soilTemperature, setSoilTemperature] = useState(
    initialValues.soilTemperature
  );
  const [luminosity, setLuminosity] = useState(initialValues.luminosity);
  const deviceId = initialValues.deviceId;

  const getClient = () => {
    return mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URL as string, {
      username: process.env.NEXT_PUBLIC_MQTT_USER,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    });
  };

  useEffect(() => {
    // INITIAL CONNECT
    const client = getClient();
    setClient(client);

    // RECONNECT
    client.on("close", () => {
      const client = getClient();
      setClient(client);
    });

    client.on("disconnect", () => {
      const client = getClient();
      setClient(client);
    });

    // SUBSCRIPTIONS
    client.on("connect", () => {
      console.log("MQTT connected");

      // SENSOR VALUES
      client.subscribe(`device/${deviceId}`, () => {
        console.log(`Subscribed to: device/${deviceId}`);
      });
      client.subscribe(`device/${deviceId}/airHumidity`, () => {
        console.log(`Subscribed to: device/${deviceId}/airHumidity`);
      });
      client.subscribe(`device/${deviceId}/airTemperature`, () => {
        console.log(`Subscribed to: device/${deviceId}/airTemperature`);
      });
      client.subscribe(`device/${deviceId}/soilMoisture`, () => {
        console.log(`Subscribed to: device/${deviceId}/soilMoisture`);
      });
      client.subscribe(`device/${deviceId}/soilPh`, () => {
        console.log(`Subscribed to: device/${deviceId}/soilPh`);
      });
      client.subscribe(`device/${deviceId}/soilTemperature`, () => {
        console.log(`Subscribed to: device/${deviceId}/soilTemperature`);
      });
      client.subscribe(`device/${deviceId}/luminosity`, () => {
        console.log(`Subscribed to: device/${deviceId}/luminosity`);
      });
    });

    client.on("message", (topic, message) => {
      switch (topic) {
        case `device/${deviceId}/airHumidity`:
          console.log("airHumidity update:", message.toString());
          setAirHumidity(parseInt(message.toString()));
          break;
        case `device/${deviceId}/airTemperature`:
          console.log("airTemperature:", message.toString());
          setAirTemperature(parseInt(message.toString()));
          break;
        case `device/${deviceId}/soilTemperature`:
          console.log("soilTemperature:", message.toString());
          setSoilTemperature(parseInt(message.toString()));
          break;
        case `device/${deviceId}/soilPh`:
          console.log("soilPh:", message.toString());
          setSoilPh(parseInt(message.toString()));
          break;
        case `device/${deviceId}/soilMoisture`:
          console.log("soilMoisture:", message.toString());
          setSoilMoisture(parseInt(message.toString()));
          break;
        case `device/${deviceId}/luminosity`:
          console.log("luminosity:", message.toString());
          setLuminosity(parseInt(message.toString()));
          break;
      }
    });
  }, [deviceId]);

  return (
    <MqttContext.Provider
      value={{
        client: client,
        deviceId: deviceId,
        airTemperature: airTemperature,
        airHumidity: airHumidity,
        soilMoisture: soilMoisture,
        soilPH: soilPh,
        soilTemperature: soilTemperature,
        luminosity: luminosity,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export const useMqttContext = () => {
  return useContext(MqttContext);
};
