import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { products } from "@/lib/db_schema";
import { format } from "date-fns";
import Image from "next/image";

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

  return (
    <main className="container lg:pt-12 pt-6">
      <h1 className="text-5xl text-center">{item?.name}</h1>

      <div className="grid lg:grid-cols-4 gap-2 lg:pt-12 text-2xl place-items-start lg:place-items-center pt-4 md:grid-cols-3 grid-cols-1">
        <span>In Stock: {item?.stock}</span>

        <span>
          Purhcase Date:{" "}
          {item?.purchase_date ? format(item?.purchase_date, "y/MM/dd") : "-"}
        </span>
        <span>Price: {dollar_format.format(item?.price ?? 0)}</span>

        <span>
          Link:
          {item?.link && <a href={item.link}>go to link</a>}
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
    </main>
  );
}
