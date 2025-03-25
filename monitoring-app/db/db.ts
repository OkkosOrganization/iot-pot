import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../drizzle/schema";
export const db = drizzle(process.env.DATABASE_URL!, { schema: schema });
import { eq, desc, sql, and, asc } from "drizzle-orm";
import { SensorValues } from "@/types";

export const getUser = async (userAuth0Id: string) => {
  const dbData = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.auth0Id, userAuth0Id))
    .leftJoin(schema.devices, eq(schema.users.id, schema.devices.userId));

  if (dbData.length) {
    const devices = dbData
      .filter((d) => {
        return d.devices === null ? false : true;
      })
      .map((d) => {
        return d.devices;
      });

    const userWithDevices = {
      ...dbData[0].users,
      devices: devices,
    };
    return userWithDevices;
  }

  return null;
};

export const getDevice = async (deviceId: string) => {
  const dbData = await db
    .select()
    .from(schema.devices)
    .where(eq(schema.devices.deviceId, deviceId));
  return dbData;
};

export const updateDevice = async (
  deviceId: string,
  title: string,
  userId: number
) => {
  const newDevice = await db
    .update(schema.devices)
    .set({ title: title, userId: userId })
    .where(eq(schema.devices.deviceId, deviceId))
    .returning();
  return newDevice;
};

export const unLinkDevice = async (deviceId: string) => {
  const newDevice = await db
    .update(schema.devices)
    .set({ title: "", userId: null })
    .where(eq(schema.devices.deviceId, deviceId))
    .returning();
  return newDevice;
};

export const getLatestMeasurements = (deviceId: string) => {
  return db
    .select()
    .from(schema.measurements)
    .where(eq(schema.measurements.deviceId, deviceId))
    .orderBy(desc(schema.measurements.id))
    .limit(1);
};

export const getMeasurementsByWeek = (
  deviceId: string,
  weekNumber: number,
  year: number
) => {
  return db
    .select()
    .from(schema.measurements)
    .where(
      sql`${schema.measurements.deviceId} = ${deviceId} 
      AND EXTRACT(YEAR FROM ${schema.measurements.timestamp}) = ${year} 
      AND EXTRACT(WEEK FROM ${schema.measurements.timestamp}) = ${weekNumber}`
    )
    .orderBy(asc(schema.measurements.timestamp));
};

export const getMeasurementsByMonth = (
  deviceId: string,
  month: number,
  year: number
) => {
  return db
    .select()
    .from(schema.measurements)
    .where(
      and(
        eq(schema.measurements.deviceId, deviceId),
        sql`EXTRACT(YEAR FROM ${schema.measurements.timestamp}) = ${year}`,
        sql`EXTRACT(MONTH FROM ${schema.measurements.timestamp}) = ${month}`
      )
    )
    .orderBy(asc(schema.measurements.timestamp));
};

export const getMeasurementsByDay = (deviceId: string, date: string) => {
  return db
    .select()
    .from(schema.measurements)
    .where(
      sql`${schema.measurements.deviceId} = ${deviceId} AND DATE(${schema.measurements.timestamp}) = ${date}`
    )
    .orderBy(asc(schema.measurements.timestamp));
};

export const addUser = (auth0Id: string) => {
  return db
    .insert(schema.users)
    .values({
      auth0Id: auth0Id,
    })
    .onConflictDoNothing()
    .returning();
};

export const addNote = (
  title: string,
  content: string,
  deviceId: string,
  date: string
) => {
  return db
    .insert(schema.notes)
    .values({
      title: title,
      content: content,
      deviceId: deviceId,
      date: date,
    })
    .onConflictDoNothing()
    .returning();
};

export const addMeasurements = (deviceId: string, data: SensorValues) => {
  return db.insert(schema.measurements).values({
    deviceId: deviceId,
    data: data,
  });
};
