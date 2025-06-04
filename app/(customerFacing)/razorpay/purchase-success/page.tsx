// app/(customerFacing)/razorpay/purchase-success/page.tsx

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type SuccessPageProps = {
  searchParams: {
    order_id?: string; // ?order_id=…
  };
};

export default function PurchaseSuccessPageWrapper(props: SuccessPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading your order…</div>
        </div>
      }
    >
      <PurchaseSuccessPage {...props} />
    </Suspense>
  );
}

async function PurchaseSuccessPage({ searchParams }: SuccessPageProps) {
  const { order_id } = await searchParams;
  if (!order_id) return notFound();

  // ─── 1) Fetch order record (include createdAt) ──────────────────────────
  const orderRecord = await db.order.findUnique({
    where: { razorpayOrderId: order_id },
    select: {
      id: true,
      productId: true,
      pricePaidInCents: true,
      status: true,        // boolean
      createdAt: true,     // purchase date
    },
  });
  if (!orderRecord) return notFound();

  // ─── 2) Fetch product details ───────────────────────────────────────────
  const product = await db.product.findUnique({
    where: { id: orderRecord.productId },
  });
  if (!product) return notFound();

  const isSuccess = orderRecord.status === true;

  // ─── 3) Create or reuse download token ─────────────────────────────────
  let downloadId: string | null = null;
  let expiresAt: Date | null = null;
  if (isSuccess) {
    // Try to find an existing non-expired token
    const existing = await db.downloadVerification.findFirst({
      where: {
        productId: product.id,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, expiresAt: true },
    });

    if (existing) {
      downloadId = existing.id;
      expiresAt = existing.expiresAt;
    } else {
      const dv = await db.downloadVerification.create({
        data: {
          productId: product.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
        },
      });
      downloadId = dv.id;
      expiresAt = dv.expiresAt;
    }
  }

  // ─── 4) Compute time‐left and button color ─────────────────────────────
  let buttonClass = "bg-accentRed hover:bg-accentRed/80"; // default wasted, unseen
  let expirationText: string | null = null;

  if (expiresAt) {
    const now = Date.now();
    const expiresMs = expiresAt.getTime();
    const diffMs = expiresMs - now;

    // Format the expiration timestamp for display:
    expirationText = new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(expiresAt);

    // If more than 60 minutes left → green button; otherwise red
    if (diffMs > 60 * 60 * 1000) {
      buttonClass = "bg-green-600 hover:bg-green-700";
    } else {
      buttonClass = "bg-red-600 hover:bg-red-700";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryBg dark:bg-primaryBg p-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* ─── 5) Order ID & Purchase Date ──────────────────────────────────── */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold text-textHeading">
            {isSuccess ? "🎉 Payment Successful!" : "❌ Payment Not Completed"}
          </h1>
          <p className="text-sm text-gray-500">
            Order #: <span className="font-mono">{orderRecord.id}</span> • Purchased on{" "}
            {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
              orderRecord.createdAt
            )}
          </p>
        </div>

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

          {/* ─── Product Details + Download / Retry Button ───────────────────── */}
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

            <div className="mt-4 space-y-2">
              {isSuccess && downloadId && expiresAt ? (
                <>
                  {/* 6) Show expiration timestamp */}
                  <p className="text-sm text-gray-500">
                    Link expires on: <strong>{expirationText}</strong>
                  </p>

                  {/* 7) Download Now button with aria-label */}
                  <Button
                    size="lg"
                    asChild
                    className={`w-full text-white rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-200 ${buttonClass}`}
                  >
                    <a
                      href={`/products/download/${downloadId}`}
                      aria-label="Download your purchased file"
                    >
                      Download Now
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="w-full bg-accentBlue text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:bg-accentBlue/80 transition-all duration-200"
                    asChild
                  >
                    <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
                  </Button>

                  {/* 7) “Back to Products” link underneath */}
                  <p className="mt-2 text-sm text-textPrimary/70 dark:text-textPrimary/50">
                    Or <Link href="/products" className="underline">browse other products</Link>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerification(productId: string) {
  const dv = await db.downloadVerification.create({
    data: {
      productId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  });
  return dv.id;
}
