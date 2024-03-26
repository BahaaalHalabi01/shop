import ShopItem from "@/components/common/product-card";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { search_product } from "@/server/product/actions/search";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

type TPageParams = {
  searchParams: { search?: string; page: string };
};


export default async function Home({ searchParams }: TPageParams) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const { data, hasNextPage } = await search_product(
    searchParams.search ?? "",
    page,
    12,
  );

  return (
    <main className="flex flex-col items-center  px-24 pt-12 gap-y-10">
      <form
        className="w-full gap-x-6 flex items-center px-2 max-w-xl justify-start mr-auto"
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
        <Button>Search</Button>
      </form>
      <div className="">
        <div className="grid xl:grid-cols-4 gap-4 w-full place-items-center pt-0 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {data.map((i) => (
            <ShopItem {...i.products} key={i.products.id} />
          ))}
        </div>
        <Pagination className="pt-12">
          <PaginationContent className="gap-x-2">
            <PaginationItem>
              <PaginationPrevious
                href={`/?page=${page - 1}`}
                className={cn("", page === 1 && "hidden")}
              />{" "}
            </PaginationItem>
            <PaginationItem className={cn(page === 1 && "hidden")}>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`/?page=${page}`} isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={`/?page=${page + 1}`}
                className={cn(!hasNextPage && "hidden")}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem className={cn(!hasNextPage && "hidden")}>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={`/?page=${page + 1}`}
                className={cn(!hasNextPage && "hidden")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  );
}
