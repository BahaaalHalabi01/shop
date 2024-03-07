import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL) throw new Error("please provide db url");

export default defineConfig({
  schema: "./lib/db_schema.ts",
  out: "./drizzle",
  driver: "libsql",
  dbCredentials: {
    url: process.env.DB_URL!,
    // authToken: process.env.DB_AUTH_TOKEN
  },
});
