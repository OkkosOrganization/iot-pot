import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { addMeasurements, getDevice } from "../../../../db/db";
import { SensorValues } from "@/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, sensorValues } = body;
  if (deviceId && sensorValues) {
    try {
      const devices = await getDevice(deviceId);
      if (devices.length) {
        if (devices[0].userId !== null) {
          await addMeasurements(deviceId, sensorValues as SensorValues);
          return NextResponse.json({ success: 1 });
        } else
          return NextResponse.json(
            { success: 0, error: "No user for device" },
            { status: 400 }
          );
      } else
        return NextResponse.json(
          { success: 0, error: "No device found" },
          { status: 400 }
        );
    } catch (e) {
      return NextResponse.json({ success: 0, error: e }, { status: 400 });
    }
  }
  return NextResponse.json({ success: 0, error: "No params" }, { status: 400 });
}
