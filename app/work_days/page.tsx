import { format } from "date-fns";
import WorkDayPicker from "./WorkDayPicker";
import WorkDayForm from "./WorkDayForm";
import db from "@/lib/db";
import { products } from "@/lib/db_schema";
import { ilike } from "drizzle-orm";

type TPageParams = {
  searchParams: { date: string };
};

export default async function WorkDays({
  searchParams: { date },
}: TPageParams) {
  
  return (
    <main className="flex flex-col px-24 pt-12 gap-y-10">
      <h1 className="text-3xl">
        Products sold on the date of{" "}
        <span className="italic">
          {date ? format(new Date(date), "PPP") : ""}
        </span>
      </h1>
      <div className="w-full flex justify-end">
        <WorkDayPicker />
      </div>
      <div className="grid">
        <WorkDayForm />
      </div>
    </main>
  );
}
