import { products } from "@/lib/db_schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { createTovar } from "./mock";
import search_client, { SearchIndex } from "@/lib/search_client";

function seed() {
  const turso = createClient({
    url: "http://127.0.0.1:8080",
  });

  const db = drizzle(turso);

  async function seedProducts() {
    const items = new Array(12).fill(0).map(createTovar);

    let res = await db.insert(products).values(items).returning();
    await search_client.index(SearchIndex.products).addDocuments(res);
  }

  void seedProducts();
}

seed();
