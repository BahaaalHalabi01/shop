import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

console.debug("connection opened");
const client = createClient({
  url: ":memory:",
});

const db = drizzle(client);

migrate(db, { migrationsFolder: "drizzle" });

console.debug("success");

client.close();

console.debug("connection closed");
