import {
  TCreateProduct,
  TCreateSale,
  products,
  sales,
  salesToProducts,
} from "@/lib/db_schema";
import { faker } from "@faker-js/faker";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";


function createTovar(): TCreateProduct {
  return {
    stock: faker.number.int({ min: 50, max: 200 }),
    name: faker.commerce.product(),
    purchase_date: faker.date.past(),
    price: Number(faker.commerce.price({ min: 10, max: 150 })),
    image,
    link: "https://google.com",
  };
}

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

      new Array(200).fill(0).map((_) =>
        sale_products.push({
          //remove time
          day: new Date(
            faker.date
              .between({
                from: new Date(2024, 2, 1),
                to: new Date(),
              })
              .toDateString(),
          ),
          sale_price: Number(faker.commerce.price()),
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

const image =
  "data:image/webp;base64,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";
