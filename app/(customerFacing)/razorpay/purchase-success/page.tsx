// app/(customerFacing)/razorpay/purchase-success/page.tsx
import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type SuccessPageProps = {
  searchParams: {
    order_id?: string; // Razorpay order_id passed in the query
  };
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  // Must “await” searchParams in Next.js 13+
  const { order_id } = await searchParams;

  // 1️⃣ If no order_id in query, 404
  if (!order_id) {
    return notFound();
  }

  // 2️⃣ Find our DB order by razorpayOrderId
  const orderRecord = await db.order.findUnique({
    where: { razorpayOrderId: order_id },
    select: {
      id: true,
      productId: true,
      pricePaidInCents: true,
      status: true,
    },
  });
  if (!orderRecord) {
    return notFound();
  }

  // 3️⃣ Fetch the product details
  const product = await db.product.findUnique({
    where: { id: orderRecord.productId },
  });
  if (!product) {
    return notFound();
  }

  // 4️⃣ Check if the DB order’s status is COMPLETED
  const isSuccess = orderRecord.status === "COMPLETED";

  // 5️⃣ If successful, create a one-time DownloadVerification
  let downloadId: string | null = null;
  if (isSuccess) {
    const dv = await db.downloadVerification.create({
      data: {
        productId: product.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    });
    downloadId = dv.id;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryBg dark:bg-primaryBg p-6">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-textHeading">
          {isSuccess ? "🎉 Payment Successful!" : "❌ Payment Failed"}
        </h1>

        <div className="flex flex-col md:flex-row gap-6 bg-secondaryBg dark:bg-secondaryBg p-6 rounded-2xl shadow-lg">
          {/* ─── Product Image ─────────────────────────────────────────────────── */}
          <div className="relative w-full md:w-1/3 aspect-video bg-bg-border dark:bg-bg-border rounded-lg overflow-hidden">
            {product.imagePath ? (
              <Image
                src={product.imagePath}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-textPrimary/60">
                No Image Available
              </div>
            )}
          </div>

          {/* ─── Product Details + Action Button ──────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="text-lg text-textPrimary/70 dark:text-textPrimary/50">
                {formatCurrency(product.priceInCents / 100)}
              </div>
              <h2 className="text-2xl font-bold text-textHeading dark:text-textHeading mb-2">
                {product.name}
              </h2>
              <p className="text-textPrimary/70 dark:text-textPrimary/50 line-clamp-3 mb-4">
                {product.description}
              </p>
            </div>

            <div>
              {isSuccess && downloadId ? (
                <Button
                  size="lg"
                  className="w-full bg-accentRed text-black dark:text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:bg-accentRed/80 transition-all duration-200"
                  asChild
                >
                  <a href={`/products/download/${downloadId}`}>Download Now</a>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full bg-accentBlue text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:bg-accentBlue/80 transition-all duration-200"
                  asChild
                >
                  <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
