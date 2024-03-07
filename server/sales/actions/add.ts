"use server";
import db from "@/lib/db";
import { TCreateSale, sales, salesToProducts } from "@/lib/db_schema";

export async function create_sale(values: TCreateSale & { productId: string }) {
  await db.transaction(async (tsx) => {
    const [item] = await tsx
      .insert(sales)
      .values({
        customer: values.customer,
        amount: values.amount,
        day: values.day,
      })
      .returning({ id: sales.id });

    await tsx.insert(salesToProducts).values({
      saleId: item.id,
      productId: Number(values.productId),
    });
  });
  return true;
}
