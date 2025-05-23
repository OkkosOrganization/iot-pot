import { NextResponse } from "next/server";
import { getWateringsByWeek } from "../../../../db/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deviceId = searchParams.get("deviceId");
  const weekNumber = searchParams.get("weekNumber");
  const year = searchParams.get("year");
  if (deviceId && year && weekNumber) {
    try {
      const data = await getWateringsByWeek(
        String(deviceId),
        Number(weekNumber),
        Number(year)
      );
      return NextResponse.json({ success: 1, data: data });
    } catch (e) {
      console.log(e);
      return NextResponse.json({ success: 0, error: e });
    }
  }
  return NextResponse.json({ success: 0, error: "Invalid params" });
}
