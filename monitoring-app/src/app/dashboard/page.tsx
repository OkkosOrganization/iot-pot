import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { UserInfo } from "../components/UserInfo";
import { LogoutButton } from "../components/LogoutButton";

export default withPageAuthRequired(
  async function DashBoardPage() {
    return (
      <UserProvider>
        <div>
          <LogoutButton />
          <UserInfo />
        </div>
      </UserProvider>
    );
  },
  { returnTo: "/" }
);
