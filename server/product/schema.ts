import { z } from "zod";

export const add_item_schema = z.object({
  name: z.string().min(1),
  stock: z.coerce.number().nonnegative(),
  price: z.coerce.number().min(0).nonnegative(),
  image: z.any().optional(),
  purchase_date: z.date().optional().default(new Date()),
  link: z.string().url().optional(),
});

export type TCreateProduct = z.infer<typeof add_item_schema>;

