import { NextRequest, NextResponse } from "next/server";
import { getDevice } from "../../../../db/db";
import { isValidEmail } from "@/utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, email } = body;

  // CHECK PARAMS
  if (!deviceId || !email) {
    return NextResponse.json(
      { success: 0, error: "Invalid params" },
      { status: 400 }
    );
  }

  // VALIDATE EMAIL
  if (!isValidEmail(email))
    return NextResponse.json(
      { success: 0, error: "Invalid email" },
      { status: 400 }
    );

  try {
    // CHECK FOR DEVICE EXISTENCE
    const devices = await getDevice(deviceId);
    if (!devices.length)
      return NextResponse.json(
        { success: 0, error: "No device found" },
        { status: 400 }
      );
    // CHECK DEVICE USER
    else if (devices[0].userId === null)
      return NextResponse.json(
        { success: 0, error: "No user connected to device" },
        { status: 400 }
      );
    else {
      // CALL MAILGUN API
      return NextResponse.json({ success: 1 });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: 0, error: e }, { status: 400 });
  }
}
