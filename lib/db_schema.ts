import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, blob } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").default("").notNull(),
  stock: integer("stock", { mode: "number" }).default(0).notNull(),
  price: integer("price", { mode: "number" }).default(0).notNull(),
  purchase_date: integer("purchase_date", { mode: "timestamp" }).default(
    sql`CURRENT_DATE`,
  ).notNull(),
  link: text("link").default(""),
  image: blob("image").default("").$type<string>(),
});

export type TProduct = typeof products.$inferSelect
export type TCreateProduct = typeof products.$inferInsert
