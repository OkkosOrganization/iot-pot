import styles from "./page.module.css";
import { LoginButton } from "./components/LoginButton";
import { Logo } from "./components/Logo";
type SP = {
  searchParams: { [key: string]: string | string[] | undefined };
};
type PageProps = {
  searchParams: Promise<SP>;
};
export default async function Home({ searchParams }: PageProps) {
  const sp = await searchParams;
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
