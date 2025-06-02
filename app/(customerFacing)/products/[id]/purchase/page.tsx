import db from "@/lib/db";
import { notFound } from "next/navigation";
import Razorpay from "razorpay";
import CheckoutForm from "./_components/CheckoutForm";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default async function PurchasePage({
  params,
}: {
  params: { id: string }; // Correctly define params type
}) {
  // Await the params to access id
  const { id } = await params;

  // Fetch the product from the database
  const product = await db.product.findUnique({ where: { id } });

  if (!product) return notFound();

  // Create a new Razorpay order
  const order = await razorpay.orders.create({
    amount: product.priceInCents, // Amount in paise
    currency: "INR",
    receipt: product.id,
    partial_payment: false,
  });

  // Create a new order in the database (ensure to fill in the necessary fields)
  /*const newOrder = await db.order.create({
    *data: {
     * pricePaidInCents: product.priceInCents,
      *razorpayOrderId: order.id,
      *razorpayPaymentId: "", // Set to empty string or actual payment ID if available
      *status: false, // Default status
      *userId: "", // Replace with actual user ID
      *productId: product.id,
    *},
  });*/

  if (!order || !order.id) {
    throw new Error("Failed to create Razorpay order");
  }

  // Render client-side checkout form with product + order.id
  return (
    <CheckoutForm
      product={product}
      orderId={order.id} // This is Razorpay order ID, used on client
    />
  );
}
