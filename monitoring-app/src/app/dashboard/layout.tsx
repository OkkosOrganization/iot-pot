import { getSession } from "@auth0/nextjs-auth0";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import { Navi } from "../components/Navi";
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
      <div className={styles.dashboard}>
        <Navi />
        <section className={styles.pageContainer}>{children}</section>
      </div>
    </UserProvider>
  );
}
