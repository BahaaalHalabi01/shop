"use server";
import db from "@/lib/db";
import { add_item_schema } from "../schema";
import { products } from "@/lib/db_schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import search_client, { SearchIndex } from "@/lib/search_client";

export async function addProduct(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    stock: Number(formData.get("stock")),
    price: Number(formData.get("price")),
    purchase_date: new Date(String(formData.get("purchase_date"))),
    image: formData.get("image"),
    link: !!formData.get("link") ? formData.get("link") : undefined,
  };

  /**@todo handle error*/
  const safe = add_item_schema.parse(rawData);

  await db
    .insert(products)
    .values({
      purchase_date: new Date(safe.purchase_date),
      link: safe.link ?? "",
      image: safe.image ?? "",
      price: safe.price,
      stock: safe.stock,
      name: safe.name,
    })
    .returning();

  // const res = await search_client
  //   .index(SearchIndex.products)
  //   .addDocuments(db_res);

  revalidatePath("/");
  redirect(`/`);
}
