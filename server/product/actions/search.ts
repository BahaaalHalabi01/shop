"use server";
import search_client, { SearchIndex } from "@/lib/search_client";

export async function search_product(name: string) {
  const data = await search_client
    .index(SearchIndex.products)
    .search(name, { limit: 12 });

  return data.hits;
}
