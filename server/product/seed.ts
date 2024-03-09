import { TCreateSale, products, sales, salesToProducts } from "@/lib/db_schema";
import { faker } from "@faker-js/faker";
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
    await db.transaction(async (tsx) => {
      const items = new Array(28).fill(0).map(createTovar);

      const products_items = await tsx
        .insert(products)
        .values(items)
        .returning();

      let sale_products: TCreateSale[] = [];

      new Array(50).fill(0).map((_) =>
        sale_products.push({
          //remove time
          day: new Date(faker.date.between({
            from: new Date(2024, 2, 1),
            to: new Date(),

          }).toDateString()),
          amount: faker.number.int({ max: 50, min: 5 }),
          customer: faker.person.fullName(),
        }),
      );

      const sales_products = (
        await tsx.insert(sales).values(sale_products).returning()
      ).map((sale) => ({
        saleId: sale.id,
        saleDay: sale.day,
        productId: products_items.at(
          faker.number.int({ min: 0, max: items.length - 1 }),
        )?.id!,
      }));

      await tsx.insert(salesToProducts).values(sales_products);
    });

    // await search_client.index(SearchIndex.products).addDocuments(res);
  }

  void seedProducts();
}

seed();
