import { NextResponse } from "next/server";
import { getMeasurementsByWeek } from "../../../../db/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deviceId = searchParams.get("deviceId");
  const weekNumber = searchParams.get("weekNumber");
  const year = searchParams.get("year");
  if (deviceId && weekNumber && year) {
    try {
      const data = await getMeasurementsByWeek(
        deviceId as string,
        parseInt(weekNumber as string),
        parseInt(year as string)
      );
      return NextResponse.json({ success: 1, data: data });
    } catch (e) {
      return NextResponse.json({ success: 0, error: e });
    }
  }
  return NextResponse.json({ success: 0, error: "No params" });
}
