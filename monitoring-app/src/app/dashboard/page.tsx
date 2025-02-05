import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export default async function DashBoardPage() {
  const session = await getSession();
  if (session?.user) {
    return <h1>Welcome {session.user.name}</h1>;
  } else return redirect("/");
}
