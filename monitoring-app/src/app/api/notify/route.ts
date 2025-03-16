import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import { getDevice } from "../../../../db/db";
import { isValidEmail } from "@/utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, email, msg } = body;

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

  // CHECK API KEY
  if (!process.env.MAILGUN_API_KEY)
    return NextResponse.json(
      { success: 0, error: "Invalid API-key" },
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
      const mailgun = new Mailgun(FormData);
      const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY as string,
        url: "https://api.eu.mailgun.net",
      });
      //const msg = `A notification for you from device: ${deviceId}`;
      const msgHtml = `<h1>${msg}</h1>`;
      const res = await mg.messages.create("mail.iot-pot.com", {
        from: "No-Reply <noreply@mail.iot-pot.com>",
        to: [email],
        subject: "IoT-Pot notification",
        text: msg,
        html: msgHtml,
        url: "https://api.eu.mailgun.net",
      });
      console.log(res);
      return NextResponse.json({ success: 1 });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: 0, error: e }, { status: 400 });
  }
}
