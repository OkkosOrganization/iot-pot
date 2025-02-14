import { NextResponse } from "next/server";
import { getMeasurementsByMonth } from "../../../../db/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deviceId = searchParams.get("deviceId");
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  if (deviceId && month && year) {
    const correctedMonth = parseInt(month) + 1; // POSTGRESQL MONTHS START FROM 1!
    try {
      const data = await getMeasurementsByMonth(
        deviceId as string,
        correctedMonth,
        parseInt(year as string)
      );
      return NextResponse.json({ success: 1, data: data });
    } catch (e) {
      return NextResponse.json({ success: 0, error: e });
    }
  }
  return NextResponse.json({ success: 0, error: "No params" });
}
