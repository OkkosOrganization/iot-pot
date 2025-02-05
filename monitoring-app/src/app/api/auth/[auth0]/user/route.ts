import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

export async function POST(request: NextRequest) {
  console.log(request.url);
  const jsonData = await request.json();
  const auth0Id = jsonData.id as string;
  const email = jsonData.email as string;
  const greeting = "Hello user: " + auth0Id + ", email: " + email;
  const json = {
    greeting,
  };
  return NextResponse.json(json);
}
