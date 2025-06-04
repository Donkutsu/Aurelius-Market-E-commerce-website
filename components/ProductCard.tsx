// components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  imagePath: string | null;
}

export function ProductCard({
  id,
  name,
  description,
  priceInCents,
  imagePath,
}: ProductCardProps) {
  // Convert cents → rupees and format via Intl.NumberFormat
  const price = (priceInCents || 0) / 100;

  return (
    <div className="bg-secondaryBg rounded-2xl shadow-lg overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-bg-border">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-textPrimary">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-textHeading mb-2">
          {name}
        </h3>
        <p className="text-textPrimary text-sm line-clamp-3 flex-1">
          {description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          {/* Price formatted as INR */}
          <span className="text-accentBlue font-medium">
            {formatCurrency(price)}
          </span>

          {/* “Buy” instead of “View” */}
          <Link href={`/products/${id}/purchase`}>
            <Button variant="adminAction" className="px-4 py-2 text-sm font-medium">
              Buy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
