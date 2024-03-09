import { format } from "date-fns";
import WorkDayPicker from "./WorkDayPicker";
import WorkDayForm from "./WorkDayForm";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import db from "@/lib/db";
import { salesToProducts } from "@/lib/db_schema";
import { eq } from "drizzle-orm";

type TPageParams = {
  searchParams: { date: string };
};



export default async function WorkDays({
  searchParams: { date },
}: TPageParams) {

  const product_sales = await db.query.salesToProducts.findMany({
    with: {
      sale: true,
      product: true,
    },
    where: eq(salesToProducts.saleDay, new Date(date)),
  });

  return (
    <main className="flex flex-col px-24 py-8 gap-y-10">
      <h1 className="text-3xl">
        Products sold on the date of{" "}
        <span className="italic">
          {date ? format(new Date(date), "PPP") : ""}
        </span>
      </h1>
      <div className="w-full flex gap-x-4 items-start justify-start">
        <WorkDayForm />
        <WorkDayPicker />
      </div>
      <DataTable data={product_sales} columns={columns} />
    </main>
  );
}
