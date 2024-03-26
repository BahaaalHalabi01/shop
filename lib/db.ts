import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./db_schema";

if (!process.env.DB_URL || !process.env.DB_TOKEN)
  throw new Error("Please provide Database configuration");

const client = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN,
});

const db = drizzle(client, {
  schema,
});

export default db;
