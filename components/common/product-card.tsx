import { TProduct } from "@/lib/db_schema";
import { format } from "date-fns";
import Image from "next/image";

type TProps = TProduct & {};

const dollar_format = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export default function ShopItem({
  name,
  id,
  stock,
  purchase_date,
  price,
  image,
}: TProps) {
  return (
    <div className="rounded-lg flex gap-x-2">
      <Image
        unoptimized={image?.length === 0}
        src={
          image?.length && image.length > 0
            ? image
            : "https://placehold.co/160x160"
        }
        className="rounded-lg"
        alt="tovar"
        width={160}
        height={160}
      />
      <div className="px-3 flex flex-col gap-y-1">
        <h2 className="text-xl">{name}</h2>
        <p>
          Current Stock: <span className="text-green-700 italic">{stock}</span>
        </p>
        <p>Price: {dollar_format.format(price)}</p>
        <p>{format(new Date(purchase_date), "dd/MM/yy")}</p>
        <div className="pt-0.5" />
        <a href={`/product/${id}`} className="border p-2 max-w-fit rounded-md">
          {" "}
          open item
        </a>
      </div>
    </div>
  );
}
