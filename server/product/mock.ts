import { faker } from "@faker-js/faker";
import { TCreateProduct } from "./schema";

export function createTovar(): TCreateProduct {
  return {
    stock: faker.number.int({ min: 10, max: 100 }),
    name: faker.commerce.product(),
    purchase_date: faker.date.past(),
    price: Number(faker.commerce.price()),
    image:'',
    link:''
  };
}
