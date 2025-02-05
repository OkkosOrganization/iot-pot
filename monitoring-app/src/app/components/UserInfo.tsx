"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
export const UserInfo = () => {
  const { user, error, isLoading } = useUser();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <pre>{JSON.stringify(user, null, 5)}</pre>
    </div>
  );
};
