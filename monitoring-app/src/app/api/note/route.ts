import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import { Device } from "@/types";
import { addNote } from "../../../../db/db";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json(
      { success: 0, error: "Not authorized" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { deviceId, title, content, date } = body;
  if (!deviceId) {
    return NextResponse.json(
      { success: 0, error: "No deviceId" },
      { status: 400 }
    );
  }

  if (!title) {
    return NextResponse.json(
      { success: 0, error: "No title" },
      { status: 400 }
    );
  }

  if (!content) {
    return NextResponse.json(
      { success: 0, error: "No content" },
      { status: 400 }
    );
  }

  if (!date) {
    return NextResponse.json({ success: 0, error: "No date" }, { status: 400 });
  }

  if (
    !session.user.db.devices.filter((d: Device) => d.deviceId === deviceId)
      .length
  )
    return NextResponse.json(
      { success: 0, error: "Not device owner" },
      { status: 400 }
    );

  try {
    await addNote(title, content, deviceId, date);
    return NextResponse.json({ success: 1 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: 0, error: e }, { status: 400 });
  }
}
