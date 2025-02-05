import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../drizzle/schema";
export const db = drizzle(process.env.DATABASE_URL!, { schema: schema });
import { eq, desc } from "drizzle-orm";

export const getUser = async (userAuth0Id: string) => {
  const dbData = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.auth0Id, userAuth0Id));
  //.leftJoin(schema.devices, eq(schema.users.id, schema.devices.userId));
  return dbData;
  /*
  console.log(userAuth0Id);
  if (dbData) {
    const devices = dbData.map((d) => {
      return d.devices;
    });

    const userWithDevices = {
      ...dbData[0].users,
      devices: devices,
    };
    return userWithDevices;
  }
  */

  return null;
};

export const getLatestMeasurements = (deviceId: number) => {
  return db
    .select()
    .from(schema.measurements)
    .where(eq(schema.measurements.deviceId, deviceId))
    .orderBy(desc(schema.measurements.id))
    .limit(1);
};
