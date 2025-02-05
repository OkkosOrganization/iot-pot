import styles from "./page.module.css";
import { getSession } from "@auth0/nextjs-auth0";

import { redirect } from "next/navigation";
import { LoginButton } from "./components/LoginButton";
import { Logo } from "./components/Logo";

export default async function Home() {
  const session = await getSession();
  if (session?.user) redirect("/dashboard");
  return (
    <div className={styles.page}>
      <Logo />
      <LoginButton />
    </div>
  );
}
