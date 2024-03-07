"use client";

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
import { add_item_schema } from "@/server/product/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useRef } from "react";
import { addProduct } from "@/server/product/actions/add";

export const AddForm = () => {

  const form = useForm<z.infer<typeof add_item_schema>>({
    defaultValues: {
      name: "",
      image: "",
      price: 0,
      stock: 0,
    },
    resolver: zodResolver(add_item_schema),
    mode: "all",
  });

  const image_blob = useRef<string | null>(null);

  function onSubmit(values: z.infer<typeof add_item_schema>) {
    const form_data = new FormData();
    for (const k in values) {
      let key = k as keyof typeof values;

      let v = values[key];
      if (!v) v = "";
      form_data.set(
        k,
        key === "image" && image_blob.current
          ? image_blob.current
          : v.toString(),
      );
    }

    void addProduct(form_data);

    removeImage();
    form.reset();
  }

  function removeImage() {
    const preview_img = window.document.getElementById(
      "preview-image",
    ) as HTMLImageElement;

    preview_img.src = "";

    const preview_div = window.document.getElementById("preview");

    preview_div?.classList.add("invisible");
    preview_div?.classList.remove("block");
  }

  function displayImage(value: ChangeEvent<HTMLInputElement>) {
    const file = value.currentTarget.files
      ? value.currentTarget.files[0]
      : null;

    if (!file) return;

    if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
      alert("only images are allowed");
      form.resetField("image");
      return;
    }

    const reader = new FileReader();
    const preview_div = window.document.getElementById("preview");
    reader.addEventListener("load", () => {
      if (reader.result) {
        image_blob.current = reader.result as string;
        preview_div?.classList.remove("invisible");
        preview_div?.classList.add("block");
        const preview_img = window.document.getElementById(
          "preview-image",
        ) as HTMLImageElement;

        preview_img.src = reader.result as string;
      }
    });
    reader.readAsDataURL(file);
  }

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-4 gap-4 pt-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name*</FormLabel>
              <FormControl>
                <Input placeholder="TV(LG) 40inch" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that shows on the item card
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock*</FormLabel>
              <FormControl>
                <Input placeholder="50" type="number" {...field} />
              </FormControl>
              <FormDescription>
                This is the amount of items purchased
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price-$*</FormLabel>
              <FormControl>
                <Input placeholder="24" type="number" {...field} />
              </FormControl>
              <FormDescription>
                Price without specifying the currency
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purchase_date"
          render={({ field: { onChange, value, ...r } }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...r}
                  onChange={(e) => onChange(new Date(e.currentTarget.value))}
                />
              </FormControl>
              <FormDescription>Leave blank to default to today</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field: { value, ...r } }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.lg.com/ru/televisions/lg-50nano829qb"
                  type="url"
                  {...r}
                />
              </FormControl>
              <FormDescription>
                Link to the item page if it exists
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, ...r } }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  placeholder="upload img to show"
                  type="file"
                  onChange={(e) => {
                    onChange(e);
                    displayImage(e);
                  }}
                  {...r}
                />
              </FormControl>
              <FormDescription>
                Upload an Image that will show on the card
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full pt-8 flex items-center justify-between">
          <div id="preview" className="invisible">
            <Image
              src=""
              width={240}
              height={240}
              alt="preview image"
              id="preview-image"
            />
          </div>

          <Button>Submit</Button>
        </div>
      </form>
    </Form>
  );
};
