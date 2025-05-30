import { PageHeader } from "../../_components/PageHeader";
import { ProductForm } from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6 p-4">
      <PageHeader>Add Product</PageHeader>
      <ProductForm />
    </div>
  );
}
