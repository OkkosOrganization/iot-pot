import { getSession } from "@auth0/nextjs-auth0";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Navi, User } from "../components/Navi";
import { ExtendedUserProvider } from "../contexts/extendedUserContext";
import styles from "./layout.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) return redirect("/");
  return (
    <UserProvider>
      <ExtendedUserProvider>
        <div className={styles.dashboard}>
          <Navi user={session?.user as User} />
          <section className={styles.pageContainer}>{children}</section>
        </div>
      </ExtendedUserProvider>
    </UserProvider>
  );
}
