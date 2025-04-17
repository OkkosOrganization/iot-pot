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

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
  deviceId: string;
  error: string;
};

export type MeasurementItem = {
  id: number;
  deviceId: string;
  timestamp: string;
  data: {
    airTemperature: number;
    airHumidity: number;
    soilMoisture: number;
    soilPh: number;
    soilTemperature: number;
    luminosity: number;
  };
  error?: string;
};

export type MeasurementsApiResponse = {
  status: 0 | 1;
  data: MeasurementItem[];
};
export type NotesApiResponse = {
  status: 0 | 1;
  data: Note[];
};

export type SensorLabels =
  | "airTemperature"
  | "airHumidity"
  | "soilMoisture"
  | "soilPh"
  | "soilTemperature"
  | "luminosity"
  | "waterLevel"
  | "waterOverflow";

export const NOTIFICATION_TYPES = [
  "soil-moisture",
  "tank-empty",
  "overflow",
] as const;
export type NotificationTypes = (typeof NOTIFICATION_TYPES)[number];
export function isNotificationType(value: string): value is NotificationTypes {
  return (NOTIFICATION_TYPES as readonly string[]).includes(value);
}
