import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_f2tzU3WdSeQN@ep-plain-hill-a26pxjd0-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require",
  },
});
