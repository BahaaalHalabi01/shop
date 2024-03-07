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
import { Loader } from "lucide-react";

type TParams = {};

export default function WorkDayForm({}: TParams) {
  const schema = z.object({
    product: z.string(),
    amount: z.number(),
  });

  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", search],
    queryFn: () => search_product(search),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      product: "",
    },
  });

  const onChangeSearchTerm = useCallback(
    (event: ChangeEvent<HTMLInputElement>, onChange: any) => {
      onChange(event);
      debouncedSearch(event.currentTarget.value);
    },
    [],
  );

  const debouncedSearch = useCallback(
    debounce((s) => {
      setSearch(s);
    }, 1500),
    [],
  );

  function onSubmit() {}

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 gap-x-8">
            <FormField
              control={form.control}
              name="product"
              render={({ field: { onChange, ...r } }) => (
                <FormItem>
                  <FormLabel>Product Id</FormLabel>
                  <div className="flex relative">
                    <FormControl>
                      <Input
                        className="pr-8"
                        placeholder="240"
                        {...r}
                        onChange={(e) => onChangeSearchTerm(e, onChange)}
                      />
                    </FormControl>

                    <div className="absolute flex right-2 -translate-y-1/2 top-1/2">
                      {isLoading && (
                        <Loader className="animate-spin text-white inline-flex" />
                      )}
                    </div>
                  </div>
                  <FormDescription>
                    The product id that was sold
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Items</FormLabel>
                  <FormControl>
                    <Input placeholder="20" type="number" {...field} />
                  </FormControl>
                  <FormDescription>Number that was sold</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="pt-8">
        {" "}
        {data?.map((i) => <div key={i.id}>{i.name}</div>)}
      </div>
    </div>
  );
}
