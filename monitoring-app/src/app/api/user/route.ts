import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id, email } = await request.json();
  console.log(id, email);
  const greeting = "Hello user: " + id + ", email: " + email;
  const json = {
    greeting,
  };
  return NextResponse.json(json);
}
