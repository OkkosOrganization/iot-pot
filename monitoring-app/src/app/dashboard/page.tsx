import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { LogoutButton } from "../components/LogoutButton";
import { UserInfo } from "../components/UserInfo";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export default async function DashBoardPage() {
  const session = await getSession();
  if (session?.user) {
    return (
      <div>
        <UserProvider>
          <div>
            <LogoutButton />
            <UserInfo />
          </div>
        </UserProvider>
      </div>
    );
  } else return redirect("/");
}
