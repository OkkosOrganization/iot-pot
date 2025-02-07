"use server";
import { getSession, updateSession } from "@auth0/nextjs-auth0";
import { addDevice, getDevice } from "../../../db/db";
import { Device } from "./Navi";

export async function AddDevice(previousState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const deviceId = formData.get("deviceId") as string;
  const session = await getSession();
  if (session?.user) {
    const userId = session.user.db.id;

    if (title && deviceId && userId) {
      const deviceRow = await getDevice(deviceId);
      console.log(deviceRow);
      const deviceExists = deviceRow.length > 0;

      if (!deviceExists) {
        try {
          const newDevice = (await addDevice(
            deviceId,
            title,
            parseInt(userId)
          )) as Device[];
          if (newDevice.length) {
            const session = await getSession();
            if (session) {
              const newSession = { ...session };
              newSession?.user.db.devices.push(newDevice[0]);
              await updateSession({ ...newSession });
            }
            return { device: newDevice, error: null };
          } else {
            return { device: [], error: "An error occured" };
          }
        } catch (e) {
          console.log(e);
          return { device: [], error: e };
        }
      }
    }
  }
}
