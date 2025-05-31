// app/(customerFacing)/products/page.tsx

import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { cache } from "@/lib/cache";
import db from "@/lib/db";
import { Suspense } from "react";

const getProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailable: true },
    orderBy: { name: "asc" },
  });
}, ["/products", "getProducts"]);

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-textHeading">Available Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<ProductSkeletonGrid />}>
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}

function ProductSkeletonGrid() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}
