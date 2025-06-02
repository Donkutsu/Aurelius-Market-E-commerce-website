// app/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  // 1) Read raw body & signature header
  const rawBody = await req.text();
  const razorpaySignature = req.headers.get("x-razorpay-signature") || "";

  // 2) Verify signature = HMAC_SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET)
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    console.error("🔐 Razorpay webhook signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 3) Parse the event payload
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    console.error("❌ Failed to parse webhook body:", err);
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  // 4) We only care about “payment.captured” here
  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  // 5) Extract relevant fields
  const paymentEntity = event.payload.payment.entity as {
    id: string;          // e.g. pay_DB-XXXXXXXX
    order_id: string;    // e.g. order_DB-YYYYYYYY
    amount: number;      // paise
    status: string;      // “captured”
    email?: string;
    notes?: Record<string, string>;
  };

  const razorpayOrderId = paymentEntity.order_id;
  const razorpayPaymentId = paymentEntity.id;

  // 6) Find your DB order by razorpayOrderId
  const existingOrder = await db.order.findUnique({
    where: { razorpayOrderId },
    include: { user: true },
  });
  if (!existingOrder) {
    console.error("🚫 No matching DB order for razorpayOrderId:", razorpayOrderId);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // 7) If status “captured”, mark COMPLETED; else FAILED
  if (paymentEntity.status === "captured") {
    await db.order.update({
      where: { razorpayOrderId },
      data: {
        status: "COMPLETED",
        razorpayPaymentId,
        pricePaidInCents: paymentEntity.amount,
      },
    });

    // 8) Optionally, create a DownloadVerification and/or send an email here
    await db.downloadVerification.create({
      data: {
        productId: existingOrder.productId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  } else {
    await db.order.update({
      where: { razorpayOrderId },
      data: { status: "FAILED", razorpayPaymentId },
    });
  }

  return NextResponse.json({ received: true });
}
