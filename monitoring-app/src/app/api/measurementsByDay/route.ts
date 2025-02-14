import { NextResponse } from "next/server";
import { getMeasurementsByDay } from "../../../../db/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deviceId = searchParams.get("deviceId");
  const date = searchParams.get("date");
  if (deviceId && date) {
    try {
      const data = await getMeasurementsByDay(deviceId as string, date);
      return NextResponse.json({ success: 1, data: data });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ success: 0, error: e });
    }
  }
  return NextResponse.json({ success: 0, error: "No params" });
}
