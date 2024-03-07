import search_client, { SearchIndex } from "@/lib/search_client";


console.log(await search_client.index(SearchIndex.products).search('pizza'));
