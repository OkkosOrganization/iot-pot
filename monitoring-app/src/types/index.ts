import { UserProfile } from "@auth0/nextjs-auth0/client";

export type Device = {
  id: number;
  deviceId: string;
  userId: number;
  title: string;
};
export type DbUser = {
  db: {
    id: number;
    auth0Id: string;
    devices: Device[];
  };
};
export type User = UserProfile & DbUser;
export type SensorValues = {
  airTemperature?: number;
  airHumidity?: number;
  soilMoisture?: number;
  soilPh?: number;
  soilTemperature?: number;
  luminosity?: number;
  deviceId: string;
  waterLevel: number;
  waterOverflow: number;
};
