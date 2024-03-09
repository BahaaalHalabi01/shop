import ShopItem from "@/components/common/product-card";
import { search_product } from "@/server/product/actions/search";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

type TPageParams = {
  searchParams: { search?: string };
};
export default async function Home({ searchParams }: TPageParams) {
  const data = await search_product(searchParams.search ?? "", 12);

  return (
    <main className="flex flex-col items-center  px-24 pt-12 gap-y-10">
      <form
        className="w-full gap-x-6 flex items-center px-2"
        action={async (data) => {
          "use server";
          const search = data.get("search") as string | null;

          redirect(search ? `/?search=${search}` : "/");
        }}
      >
        <button>
          <Search />
        </button>
        <input
          id="search"
          name="search"
          placeholder="Search products.."
          aria-label="search products"
          type="search"
          className=" flex-1 bg-gray-700 h-10 px-3 rounded-md"
        />
      </form>
      <section className="grid xl:grid-cols-4 gap-4 w-full place-items-center pt-0 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {data.map((i) => (
          <ShopItem {...i} key={i.id} />
        ))}
      </section>
    </main>
  );
}
