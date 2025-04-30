import { NextRequest, NextResponse } from "next/server";
import { unLinkDevice } from "../../../../../../db/db";
import { getSession, updateSession } from "@auth0/nextjs-auth0";
import { Device } from "@/types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const _params = await params;
  if (!session?.user) {
    return NextResponse.json(
      { success: 0, error: "Not authorized" },
      { status: 400 }
    );
  }

  if (!_params.id) {
    return NextResponse.json(
      { success: 0, error: "No deviceId" },
      { status: 400 }
    );
  }

  if (
    !session.user.db.devices.filter((d: Device) => d.deviceId === _params.id)
      .length
  )
    return NextResponse.json(
      { success: 0, error: "Not device owner" },
      { status: 400 }
    );

  try {
    await unLinkDevice(_params.id);
    const newSession = { ...session };
    newSession.user.db.devices = newSession?.user.db.devices.filter(
      (d: Device) => d.deviceId !== _params.id
    );
    await updateSession({ ...newSession });
    return NextResponse.json({ success: 1 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: 0, error: e }, { status: 400 });
  }
}
