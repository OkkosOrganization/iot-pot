"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import styles from "./UserInfo.module.css";
export const UserInfo = () => {
  const { user } = useUser();

  return (
    <div className={styles.container}>
      <p>{JSON.stringify(user, null, 5)}</p>
    </div>
  );
};
