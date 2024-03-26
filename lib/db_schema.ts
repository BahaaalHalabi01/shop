import { relations, sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  blob,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { AdapterAccount } from "next-auth/adapters";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp" }),
  image: text("image"),
});




export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const products = sqliteTable("products", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  stock: integer("stock", { mode: "number" }).default(0).notNull(),
  price: integer("price", { mode: "number" }).default(0).notNull(),
  purchase_date: integer("purchase_date", { mode: "timestamp" })
    .default(sql`CURRENT_DATE`)
    .notNull(),
  link: text("link").default("").notNull(),
  image: blob("image").default("").notNull().$type<string>(),
});
export const productsRelations = relations(products, ({ many }) => ({
  productsSales: many(salesToProducts),
}));

export const sales = sqliteTable("sales", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  amount: integer("amount", { mode: "number" }).notNull(),
  customer: text("customer").default("").notNull(),
  day: integer("day", { mode: "timestamp" }).notNull(),
  sale_price: integer("sale_price", { mode: "number" }).notNull(),
});

export const salesRelations = relations(sales, ({ many }) => ({
  productsSales: many(salesToProducts),
}));

export const salesToProducts = sqliteTable(
  "sales_to_products",
  {
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    saleId: integer("sale_id")
      .notNull()
      .references(() => sales.id, { onDelete: "cascade" }),
    saleDay: integer("day", { mode: "timestamp" }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.productId, t.saleId] }),
  }),
);

export const salesToProductsRelations = relations(
  salesToProducts,
  ({ one }) => ({
    product: one(products, {
      fields: [salesToProducts.productId],
      references: [products.id],
    }),
    sale: one(sales, {
      fields: [salesToProducts.saleId],
      references: [sales.id],
    }),
  }),
);

export type TProduct = typeof products.$inferSelect;
export type TCreateProduct = typeof products.$inferInsert;

export type TSale = typeof sales.$inferSelect;
export type TCreateSale = typeof sales.$inferInsert;

export type TSaleProduct = typeof salesToProducts.$inferSelect & {
  product: TProduct;
  sale: TSale;
};
