import ShopItem from "@/components/common/product-card";
import db from "@/lib/db";
import { products } from "@/lib/db_schema";
import { Search } from "lucide-react";

export default async function Home() {
  const data = await db.select().from(products).limit(12);

  const x = await db.select().from(products).limit(12);

  return (
    <main className="flex flex-col items-center  px-24 pt-12 gap-y-10">
      <div className="w-full gap-x-6 flex items-center px-2">
        <button>
          <Search />
        </button>
        <input
          placeholder="Search products.."
          aria-label="search products"
          type="search"
          className=" flex-1 bg-gray-700 h-10 px-3 rounded-md"
        />
      </div>
      <section className="grid xl:grid-cols-4 gap-4 w-full place-items-center pt-0 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {data.map((i) => (
          <ShopItem {...i} key={i.id} />
        ))}
      </section>
    </main>
  );
}
