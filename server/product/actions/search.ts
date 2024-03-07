"use server";
import db from "@/lib/db";
import { eq, ilike, like, or } from "drizzle-orm";
import { TProduct, products } from "@/lib/db_schema";
import search_client, { SearchIndex } from "@/lib/search_client";

export async function search_product(value: string) {
  // const data = await search_client
  //   .index(SearchIndex.products)
  //   .search(name, { limit: 12 });

  // return data.hits as Array<(typeof data.hits)[0] & TProduct>;
  //

  if (Number.parseInt(value)) {
    console.log(value);
    return db.query.products.findMany({
      limit: 8,
      where: eq(products.price, Number(value)),
    });
  }

  return db.query.products.findMany({
    limit: 8,
    ...(value.length > 0 && { where: like(products.name, `${value}%`) }),
  });
}
