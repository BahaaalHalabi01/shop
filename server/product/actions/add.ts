"use server";
import db from "@/lib/db";
import { add_item_schema } from "../schema";
import { products } from "@/lib/db_schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function addProduct(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    stock: Number(formData.get("stock")),
    price: Number(formData.get("price")),
    purchase_date: new Date(String(formData.get("purchase_date"))),
    image: formData.get("image") as File,
    link: !!formData.get("link") ? formData.get("link") : undefined,
  };

  /**@todo handle error*/
  const safe = add_item_schema.parse(rawData);

  const prefix = "data:image/webp;base64,";
  const buffer = await (safe.image as File).arrayBuffer();
  const image = await sharp(buffer)
    .resize({ width: 240, height: 240, fit: "fill" })
    .webp()
    .toBuffer();

  await db
    .insert(products)
    .values({
      purchase_date: new Date(safe.purchase_date),
      link: safe.link ?? "",
      image: image ? prefix + image.toString("base64") : "",
      price: safe.price,
      stock: safe.stock,
      name: safe.name,
    })
    .returning();

  revalidatePath("/");
  redirect(`/`);
}
