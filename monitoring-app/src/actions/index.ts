"use server";
import { getSession, updateSession } from "@auth0/nextjs-auth0";
import { updateDevice, getDevice } from "../../db/db";
import { Device } from "../types";

export async function AddDevice(previousState: unknown, formData: FormData) {
  const title = formData.get("title") as string;
  const deviceId = formData.get("deviceId") as string;
  const session = await getSession();
  if (session?.user) {
    const userId = session.user.db.id;

    if (title && deviceId && userId) {
      const deviceRow = await getDevice(deviceId);
      const deviceExists = deviceRow.length > 0;
      if (deviceExists) {
        if (deviceRow[0].userId === null) {
          try {
            const newDevice = (await updateDevice(
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
              return { device: [], error: "An error occured ❌" };
            }
          } catch (e) {
            console.log(e);
            const err = e as string;
            return { device: [], error: err.toString() };
          }
        } else {
          console.log("Device in use:", deviceRow[0].userId);
          return { device: [], error: "Device already in use ❌" };
        }
      } else {
        return { device: [], error: "No device found ❌" };
      }
    }
  }
}
