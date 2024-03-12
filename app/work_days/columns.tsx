"use client";

import { TSaleProduct } from "@/lib/db_schema";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TSaleProduct>[] = [
  {
    accessorKey: "product.name",
    header: "Name",
  },
  {
    accessorKey: "product.price",
    header: "Price ($)",
  },
  {
    accessorKey: "sale.sale_price",
    header: "Sale Price ($)",
  },
  {
    accessorKey: "sale.amount",
    header: "Amount",
  },
  {
    accessorKey: "sale.customer",
    header: "Customer",
  },
  {
    id: "profit",
    header: "Profit",
    accessorFn: (row) => {
      return Math.round((row.sale.sale_price / row.product.price) * 100)+"%";
    },
  },
];
