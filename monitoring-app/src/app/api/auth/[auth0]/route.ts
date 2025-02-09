import {
  AppRouteHandlerFnContext,
  getSession,
  handleAuth,
  handleCallback,
  Session,
} from "@auth0/nextjs-auth0";
import { addUser, getUser } from "../../../../../db/db";
import { NextRequest, NextResponse } from "next/server";

const afterCallback = async (req: Request, session: Session) => {
  const { user } = session;
  if (user?.email_verified === true) {
    const dbUser = await getUser(user.sub);
    if (dbUser) user.db = dbUser;
    else {
      const newUser = await addUser(user.sub);
      user.db = newUser;
      user.db.devices = [];
    }
    delete session.refreshToken;
  }
  return session;
};

export const GET = handleAuth({
  callback: async (req: NextRequest, ctx: AppRouteHandlerFnContext) => {
    try {
      const response = await handleCallback(req, ctx, { afterCallback });
      const session = await getSession(req, response as NextResponse);
      if (session?.user.email_verified === true)
        response.headers.set("location", "/dashboard");
      else response.headers.set("location", "/?email-not-verified");
      return response;
    } catch (error) {
      console.error(error);
      const r = new Response();
      r.headers.set("location", "/");
      return r;
    }
  },
});
