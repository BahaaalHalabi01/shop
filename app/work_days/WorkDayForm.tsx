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
import { ChangeEvent, useCallback, useState } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";

type TParams = {};

export default function WorkDayForm({}: TParams) {
  const params = useSearchParams();
  const date = params.get("date");

  const schema = z.object({
    product: z.object({
      name: z.string().min(0),
      id: z.string(),
      price: z.number(),
    }),
    amount: z.number(),
    customer: z.string().optional(),
  });

  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", search],
    queryFn: () => search_product(search),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
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

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!date) return;
    try {
      const res = await create_sale({
        amount: values.amount,
        customer: values.customer,
        productId: values.product.id,
        day: new Date(date),
      });
      alert(res)
    } catch (err) {}

    form.reset();
  }

  if (!date) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-4 gap-x-8">
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
                          "w-[200px] justify-between",
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
                        {data &&
                          !isLoading &&
                          data.map((product) => (
                            <CommandItem
                              value={product.id + ""}
                              key={product.id}
                              onSelect={(v) =>
                                field.onChange({
                                  name: product.name,
                                  id: v,
                                  price: product.price,
                                })
                              }
                            >
                              {product.name} ({product.price}$)
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  product.id + "" === field.value?.id
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field: { onChange, ...r } }) => (
              <FormItem className="max-w-fit">
                <FormLabel>Number of Items*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="20"
                    type="number"
                    {...r}
                    onChange={(e) => onChange(Number(e.currentTarget.value))}
                  />
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
              <FormItem className="max-w-fit">
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
