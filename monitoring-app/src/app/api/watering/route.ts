import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { addWateringEntry, getDevice } from "../../../../db/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, amount } = body;
  if (deviceId && amount) {
    try {
      const devices = await getDevice(deviceId);
      if (devices.length) {
        if (devices[0].userId !== null) {
          await addWateringEntry(deviceId, amount);
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
