"use server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { TCreateSale, products, sales, salesToProducts } from "@/lib/db_schema";

export async function create_sale(values: TCreateSale & { productId: string }) {
  const product = (
    await db
      .select()
      .from(products)
      .where(eq(products.id, Number(values.productId)))
  )[0];

  if (!product) {
    return { sucess: false };
  }

  if (product.stock < values.amount) {
    return {
      succes: false,
      message: "Selling more items than there is in stock",
    };
  }

  await db.transaction(async (tsx) => {
    const [item] = await tsx
      .insert(sales)
      .values({
        customer: values.customer,
        amount: values.amount,
        day: values.day,
      })
      .returning({ id: sales.id, day: sales.day, amount: sales.amount });

    await tsx.insert(salesToProducts).values({
      saleId: item.id,
      productId: Number(values.productId),
      saleDay: item.day,
    });

    const new_stock = product.stock - item.amount;
    await tsx.update(products).set({
      stock: new_stock > 0 ? new_stock : 0,
    });
  });

  revalidatePath("/work_days");

  return { success: true };
}
