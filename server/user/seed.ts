import { accounts, users } from "@/lib/db_schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as bcrypt from "bcrypt";

const password = "";
const salt = 0;

async function createUser() {
  const turso = createClient({
    url: "http://127.0.0.1:8080",
  });

  const db = drizzle(turso);

  await db.transaction(async (tsx) => {
    const userId = crypto.randomUUID();

    let hash = bcrypt.hashSync(password, salt);

    await tsx.insert(users).values({
      id: userId,
      email: "",
      name: "",
      emailVerified: new Date(),
      password: hash,
    });

    await tsx.insert(accounts).values({
      provider: "email",
      type: "email",
      userId: userId,
      providerAccountId: "FFFF",
    });
  });
}

createUser();
