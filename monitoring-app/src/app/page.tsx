import styles from "./page.module.css";
import { LoginButton } from "./components/LoginButton";
import { Logo } from "./components/Logo";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sp = (await searchParams) as SearchParams;
  const emailNotVerified = "email-not-verified" in sp;
  return (
    <div className={styles.page}>
      <Logo />
      <LoginButton />

      {emailNotVerified ? (
        <p style={{ textAlign: "center" }}>
          Email address not verified:
          <br />
          please check your email and verify your email address
        </p>
      ) : null}
    </div>
  );
}
