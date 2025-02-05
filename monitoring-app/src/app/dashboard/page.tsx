import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function DashBoardPage() {
  const session = await getSession();
  if (session?.user) {
    return (
      <div>
        <h1>Welcome {session.user.name}</h1>
        <a href="/api/auth/logout">LOGOUT</a>
        <pre>{JSON.stringify(session, null, 5)}</pre>
      </div>
    );
  } else return redirect("/");
}
