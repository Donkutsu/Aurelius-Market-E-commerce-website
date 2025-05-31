// app/admin/products/new/page.tsx
import { PageHeader } from "../../_components/PageHeader";
import { ProductForm } from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="bg-secondaryBg min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <PageHeader className="text-2xl font-bold text-textHeading">
          Add Product
        </PageHeader>
        <ProductForm />
      </div>
    </div>
  );
}
