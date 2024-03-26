import { NextRequest } from "next/server";
import db from "@/lib/db";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as Partial<
    Record<"username" | "password", unknown>
  >;



  return Response.json({ success: true });
};
