import { handleAuth, handleCallback, Session } from "@auth0/nextjs-auth0";
import { addUser, getUser } from "../../../../../db/db";
const afterCallback = async (req: Request, session: Session) => {
  const dbUser = await getUser(session.user.sub);
  const user = { ...session.user };
  console.log(dbUser);
  if (dbUser) user.db = dbUser;
  else {
    const newUser = await addUser(session.user.sub, session.user.email);
    user.db = newUser;
  }

  delete session.refreshToken;
  return { ...session, user: user };
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
});
