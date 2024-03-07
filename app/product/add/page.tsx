import {AddForm} from "./add-form";

export  default async function Page() {
  return (
    <main className="container pt-12">
      <h1 className="text-4xl">Add a new Product</h1>
      <AddForm/>
    </main>
  );
}
