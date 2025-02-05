import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db/db";
import { users } from "../../../../drizzle/schema";

export async function POST(request: NextRequest) {
  const { id, email } = await request.json();
  console.log(id, email);

  if (!id) return NextResponse.json({ success: 0, error: "No auth0 id" });

  try {
    const rowId = await db
      .insert(users)
      .values({
        auth0Id: id,
        email: email,
      })
      .returning({ dbId: users.id });
    return NextResponse.json({ success: 1, data: rowId });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: 0, error: e });
  }
}
