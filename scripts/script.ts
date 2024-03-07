import search_client, { SearchIndex } from "@/lib/search_client";

await search_client
  .index(SearchIndex.products)
  .updateSearchableAttributes(["name", "price"]);
