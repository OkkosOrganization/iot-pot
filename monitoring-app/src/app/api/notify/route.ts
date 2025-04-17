import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import { getDevice } from "../../../../db/db";
import { isValidEmail } from "@/utils";
import { isNotificationType } from "../../../types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, email, type } = body;

  // CHECK PARAMS
  if (!deviceId || !email || !type) {
    return NextResponse.json(
      { success: 0, error: "Invalid params" },
      { status: 400 }
    );
  }

  // CHECK NOTIFICATION TYPE
  if (!isNotificationType(type))
    return NextResponse.json(
      { success: 0, error: "Invalid type" },
      { status: 400 }
    );

  if (!isValidEmail(email))
    // VALIDATE EMAIL
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
      let msg = "";
      let subject = "";

      // MSG AND TITLE
      switch (type) {
        case "soil-moisture":
          subject = "IoT-pot notification: soil moisture";
          msg = "Soil moisture has dropped below the set threshold.";
          break;
        case "overflow":
          subject = "IoT-pot notification: water overflow";
          msg =
            "There is water below the pot, please check and drain the water.";
          break;
        case "tank-empty":
          subject = "IoT-pot notification: tank empty";
          msg = "The water tank is almost empty, please fill it.";
          break;
      }

      const msgHtml = `<p style="text-align:center;"><img src="https://iot-pot.com/LOGO.png" width="81" height="80" alt="Logo" align="center" style="margin: 0 auto;" /></p><p style="text-align:center">${msg}</p>`;
      const res = await mg.messages.create("mail.iot-pot.com", {
        from: "No-Reply <noreply@mail.iot-pot.com>",
        to: [email],
        subject: subject,
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
