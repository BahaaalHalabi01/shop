"use server";
import db from "@/lib/db";
import { SQL, and, asc, eq, like } from "drizzle-orm";
import { products } from "@/lib/db_schema";

export async function search_product(value: string, page = 1, limit = 8) {
  const orderBy = (asc(products.name), asc(products.id));
  const sq = db
    .select({ id: products.id })
    .from(products)
    .orderBy(orderBy)
    .limit(limit + 1)
    .offset((page - 1) * limit)
    .as("subquery");

  let where: SQL<unknown> | undefined = eq(sq.id, products.id);

  if (Number.parseInt(value)) {
    where = eq(products.price, Number(value));
  } else if (value.length > 0)
    where = and(like(products.name, `${value}%`), eq(sq.id, products.id));

  const data = await db
    .select()
    .from(products)
    .where(where)
    .innerJoin(sq, eq(products.id, sq.id))
    .orderBy(orderBy);

  return {
    data: data.slice(0, limit),
    hasNextPage: !!data[limit],
  };
}
