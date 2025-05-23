import { NextResponse } from "next/server";
import { getWateringsByMonth } from "../../../../db/db";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const deviceId = searchParams.get("deviceId");
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  if (deviceId && year && month) {
    const correctedMonth = parseInt(month) + 1; // POSTGRESQL MONTHS START FROM 1!
    try {
      const data = await getWateringsByMonth(
        String(deviceId),
        Number(correctedMonth),
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
