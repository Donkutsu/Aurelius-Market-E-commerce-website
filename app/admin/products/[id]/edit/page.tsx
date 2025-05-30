// app/admin/products/[id]/page.tsx
import React from "react";
import db from "@/lib/db";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";


export default async function EditProductPage(
  { params: { id } }: { params: { id: string } }
) {
  // Fetch the product on the server
  const product = await db.product.findUnique({ where: { id } });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </div>
  );
}