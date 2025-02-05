import styles from "./LoginButton.module.css";

export const LoginButton = () => {
  return (
    <a href={"/api/auth/login"}>
      <button className={styles.loginBtn}>LOG IN</button>
    </a>
  );
};
