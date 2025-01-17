"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { search_product } from "@/server/product/actions/search";
import { CheckIcon, ChevronsUpDown, Loader } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import { create_sale } from "@/server/sales/actions/add";
import { useSearchParams } from "next/navigation";

type TParams = {};

export default function WorkDayForm({}: TParams) {
  const params = useSearchParams();
  const date = Number(params.get("date"));

  const schema = z.object({
    product: z.object({
      name: z.string().min(1),
      id: z.string().min(1),
      price: z.number(),
    }),
    sale_price: z.coerce.number().gt(0),
    amount: z.coerce.number().gt(0),
    customer: z.string().optional(),
  });

  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", search],
    queryFn: () => search_product(search, 16),
  });

  const products = data?.data;
  const hasNextPage = data?.hasNextPage;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer: "",
    },
  });

  const handleSearchChange = useCallback((value: string) => {
    debouncedSearch(value);
  }, []);

  const debouncedSearch = useCallback(
    debounce((s) => {
      setSearch(s);
    }, 1500),
    [],
  );

  async function onSubmit(v: z.infer<typeof schema>) {
    if (!date) return;
    try {
      const values: Parameters<typeof create_sale>[0] = {
        sale_price: v.sale_price,
        amount: v.amount,
        customer: v.customer,
        productId: v.product.id,
        day: new Date(date),
      };

      const res = await create_sale(values);

      if (res.success) return form.reset();

      form.reset({
        ...values,
        product: v.product,
      });

      alert(res.message);
    } catch (err) {
      alert((err as Error).message);
    }
  }

  if (!date) return null;

  const product_error = form.formState.errors.product?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <div className="grid lg:grid-cols-4 lg:gap-x-8 lg:gap-2 grid-cols-1 md:grid-cols-2 gap-y-5">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Product Id*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between w-full",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value?.name
                          ? field.value.name + ` (${field.value.price}$)`
                          : "Select Product"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        onValueChange={handleSearchChange}
                        placeholder="Search for product..."
                        className="h-9"
                      />
                      {!isLoading && (
                        <CommandEmpty>No products found</CommandEmpty>
                      )}

                      <CommandList>
                        {isLoading && (
                          <CommandLoading>
                            <div className="flex items-center justify-between flex-row p-3">
                              <p className="inline-flex">Loading...</p>
                              <Loader className="animate-spin text-white inline-flex" />
                            </div>
                          </CommandLoading>
                        )}
                        {products &&
                          !isLoading &&
                          products.map((p) => (
                            <CommandItem
                              value={p.products.id + ""}
                              key={p.products.id}
                              onSelect={(v) =>
                                field.onChange({
                                  name: p.products.name,
                                  id: v,
                                  price: p.products.price,
                                })
                              }
                            >
                              {p.products.name} ({p.products.price}$)
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  p.products.id + "" === field.value?.id
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>The product id that was sold</FormDescription>
                {product_error && product_error.length > 0 && (
                  <p className={"text-sm font-medium text-destructive"}>
                    {"Product is required"}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem className="flex flex-col ">
                <FormLabel>Selling Price ($)</FormLabel>
                <FormControl>
                  <Input placeholder="40" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  The price that the item was sold at
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className=" flex flex-col ">
                <FormLabel>Number of Items*</FormLabel>
                <FormControl>
                  <Input placeholder="20" type="number" {...field} />
                </FormControl>
                <FormDescription>Number that was sold</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customer"
            render={({ field }) => (
              <FormItem className=" flex flex-col ">
                <FormLabel>Name of the customer</FormLabel>
                <FormControl>
                  <Input placeholder="Bahaa" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the name of customer if needed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
