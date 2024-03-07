import { MeiliSearch } from "meilisearch";

export enum SearchIndex {
  products = "products",
}

let host = process.env.SEARCH_URL;
let apiKey = process.env.SEARCH_KEY;

if (!host || !apiKey) throw new Error("please provide search configuration");

const search_client = new MeiliSearch({
  host,
  apiKey,
});

export default search_client;
