import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { addMeasurements } from "../../../../db/db";
import { SensorValues } from "@/app/contexts/mqttContext";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, sensorValues } = body;
  if (deviceId && sensorValues) {
    console.log(deviceId, sensorValues);
    try {
      await addMeasurements(deviceId, sensorValues as SensorValues);
      return NextResponse.json({ success: 1 });
    } catch (e) {
      return NextResponse.json({ success: 0, error: e }, { status: 400 });
    }
  }
  return NextResponse.json({ success: 0, error: "No params" }, { status: 400 });
}
