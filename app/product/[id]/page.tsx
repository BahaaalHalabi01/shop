import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { products, salesToProducts } from "@/lib/db_schema";
import { format } from "date-fns";
import Image from "next/image";
import { DataTable } from "@/app/work_days/data-table";
import { columns } from "@/app/work_days/columns";

type TPageParams = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: TPageParams) {
  const dollar_format = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  });
  const item = (
    await db
      .select()
      .from(products)
      .where(eq(products.id, Number(params.id)))
  )[0];

  const product_sales = await db.query.salesToProducts.findMany({
    with: {
      sale: true,
      product: true,
    },
    where: eq(salesToProducts.productId, Number(params.id)),
  });

  return (
    <main className="container lg:pt-12 pt-6">
      <h1 className="text-5xl text-center">{item?.name}</h1>

      <div className=" lg:pt-12 text-2xl pt-4 flex items-center gap-x-6">
        <span className="border p-3 rounded-md">In Stock: {item?.stock}</span>

        <span className="border p-3 rounded-md">
          Purhcase Date:{" "}
          {item?.purchase_date ? format(item?.purchase_date, "y/MM/dd") : "-"}
        </span>
        <span className="border p-3 rounded-md">
          Price: {dollar_format.format(item?.price ?? 0)}
        </span>

        <span className="border p-3 rounded-md">
          Link:
          {item?.link && <a href={item.link}>go to link</a>}
        </span>
        <span className="border p-3 rounded-md">
          Total Sales: {product_sales.length}
        </span>
      </div>
      {!!item?.image && (
        <div className="w-full flex items-end justify-end pt-60">
          <Image
            width={360}
            height={360}
            alt="img"
            src={item.image as string}
          />
        </div>
      )}

      <div className="pt-8">
        <DataTable data={product_sales} columns={columns} />
      </div>
    </main>
  );
}
