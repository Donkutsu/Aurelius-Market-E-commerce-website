import Razorpay from "razorpay";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { CheckoutForm } from "./_components/CheckoutForm";

type PurchasePageProps = {
  params: { id: string };
};

export default async function PurchasePage({ params }: PurchasePageProps) {
  const { id: productId } = await params; // Await params here

  // --- 1) Fetch the product from the database on the server
  const product = await db.product.findUnique({
    where: { id: productId },
  });

  // If no product, return 404
  if (!product) {
    return notFound();
  }

 const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});
const receiptId = `receipt_${product.id.substring(0, 30)}`; // Ensure receipt length is <= 40
const order = await razorpay.orders.create({
  amount: product.priceInCents, // e.g. ₹500.00 → 50000 paise
  currency: "INR",
  receipt: receiptId, // Use the truncated receipt ID
  notes: { productId: product.id },
});

  // --- 3) Render the client‐side checkout component, passing product + orderId + key
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondaryBg p-4">
      <CheckoutForm
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          priceInCents: product.priceInCents,
          imagePath: product.imagePath,
        }}
        orderId={order.id}
        razorpayKey={process.env.RAZORPAY_KEY_ID as string}
      />
    </div>
  );
}
