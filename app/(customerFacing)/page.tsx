// app/page.tsx (or wherever your HomePage lives)
import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Product } from "../generated/prisma";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { ProductCard } from "@/components/ProductCard";
import { cache } from "@/lib/cache";

// Fetch top 6 most popular products (cached 24h)
const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailable: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

// Fetch top 6 newest products
const getNewestProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  },
  ["/", "getNewestProducts"]
);

export default function HomePage() {
  return (
    <main className="space-y-12 px-4 md:px-8 lg:px-16 max-w-5xl mx-auto">
      <ProductGridSection
        title="Most Popular"
        productsFetcher={getMostPopularProducts}
      />
      <ProductGridSection
        title="Newest Arrivals"
        productsFetcher={getNewestProducts}
      />
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

function ProductGridSection({
  productsFetcher,
  title,
}: ProductGridSectionProps) {
  return (
    <section className="space-y-4">
      {/* Header Row: Title + View All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-textHeading">{title}</h2>
        <Button variant="outline" asChild>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 text-accentBlue hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 stroke-current" />
          </Link>
        </Button>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </section>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  const products = await productsFetcher();
  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-secondaryBg rounded-2xl shadow-lg overflow-hidden"
        >
          <ProductCard {...product} />
        </div>
      ))}
    </>
  );
}
