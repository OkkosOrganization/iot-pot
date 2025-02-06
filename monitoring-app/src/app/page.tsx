import styles from "./page.module.css";
import { LoginButton } from "./components/LoginButton";
import { Logo } from "./components/Logo";

export default async function Home() {
  return (
    <div className={styles.page}>
      <Logo />
      <LoginButton />
    </div>
  );
}
