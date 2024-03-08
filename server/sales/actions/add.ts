"use server";
import { revalidatePath } from "next/cache";
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
      .returning({ id: sales.id, day: sales.day });

    await tsx.insert(salesToProducts).values({
      saleId: item.id,
      productId: Number(values.productId),
      saleDay: item.day,
    });
  });

  revalidatePath("/work_days");

  return true;
}
