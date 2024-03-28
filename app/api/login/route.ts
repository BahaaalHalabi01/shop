import { NextRequest } from "next/server";
import db from "@/lib/db";
import { accounts, users } from "@/lib/db_schema";
import { and, eq } from "drizzle-orm";
import * as bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as Partial<
    Record<"username" | "password", string>
  >;
  if (!body.username || !body.password) return Response.error();

  const unauth_res = new Response(null, {
    status: 403,
    statusText: "unauthorized request",
  });

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, body.username));

  if (!user[0]) {
    return unauth_res;
  }

  const valid = await bcrypt.compare(body.password, user[0].password);

  if (!valid) return unauth_res;

  return Response.json(user[0]);
};
