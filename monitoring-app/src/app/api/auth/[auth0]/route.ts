import { handleAuth, handleCallback, Session } from "@auth0/nextjs-auth0";
import { getUser } from "../../../../../db/db";
const afterCallback = async (req: Request, session: Session) => {
  const dbUser = await getUser(session.user.sub);
  let user = { ...session.user };
  if (dbUser) user.db = dbUser[0];
  delete session.refreshToken;
  return { ...session, user: user };
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});
