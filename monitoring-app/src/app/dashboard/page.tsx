import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashBoardPage() {
  const session = await getSession();
  if (session?.user) {
    return (
      <div>
        <h1>Welcome {session.user.name}</h1>
        <Link href="/api/auth/logout">LOGOUT</Link>
        <pre>{JSON.stringify(session, null, 5)}</pre>
      </div>
    );
  } else return redirect("/");
}
