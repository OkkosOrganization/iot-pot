import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../drizzle/schema";
export const db = drizzle(process.env.DATABASE_URL!, { schema: schema });
import { eq, desc } from "drizzle-orm";

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

export const addDevice = async (
  deviceId: string,
  title: string,
  userId: number
) => {
  const newDevice = await db
    .insert(schema.devices)
    .values({ deviceId: deviceId, title: title, userId: userId })
    .returning();
  return newDevice;
};

export const getLatestMeasurements = (deviceId: number) => {
  return db
    .select()
    .from(schema.measurements)
    .where(eq(schema.measurements.deviceId, deviceId))
    .orderBy(desc(schema.measurements.id))
    .limit(1);
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
