import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";
import { Resend } from "resend";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";

export async function POST(req: NextRequest) {
  // 1) Read raw body (text) to verify signature
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("❌ Razorpay webhook signature mismatch");
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  const eventType = event.event;

  // 4) Common fields from Razorpay payload
  const payment = event.payload?.payment?.entity;
  if (!payment) {
    console.error("❌ No payment entity in webhook payload");
    return new NextResponse("No payment data", { status: 400 });
  }

  const razorpayOrderId = payment.order_id as string;
  const razorpayPaymentId = payment.id as string;
  const email = (payment.email as string) || null;
  const amount = payment.amount as number;
  const notes = payment.notes as { [key: string]: string } | null;
  const productId = notes?.productId || null;

  if (!razorpayOrderId || !productId) {
    console.error("❌ Missing razorpayOrderId or productId in payment.notes");
    return new NextResponse("Bad Request", { status: 400 });
  }
  if (!email) {
    console.error("❌ No email attached to payment");
    return new NextResponse("Bad Request", { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY as string); // Initialize Resend

  try {
    const user = await db.user.upsert({
      where: { email },
      create: { email },
      update: {},
    });

    if (eventType === "payment.authorized") {
      await db.order.upsert({
        where: { razorpayOrderId },
        create: {
          pricePaidInCents: amount,
          razorpayOrderId,
          razorpayPaymentId: "",
          status: false,
          productId,
          userId: user.id,
        },
        update: {
          status: false,
        },
      });
    } else if (eventType === "payment.captured") {
      const order = await db.order.upsert({
        where: { razorpayOrderId },
        create: {
          pricePaidInCents: amount,
          razorpayOrderId,
          razorpayPaymentId,
          status: true,
          productId,
          userId: user.id,
        },
        update: {
          razorpayPaymentId,
          status: true,
        },
      });

      // Send confirmation email after successful payment capture
      const product = await db.product.findUnique({ where: { id: productId } });
      if (!product) {
        console.error("❌ Product not found for productId:", productId);
        return new NextResponse("Product not found", { status: 400 });
      }
      const downloadVerification = await db.downloadVerification.create({
        data: {
          productId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        },
      });

      await resend.emails.send({
        from: `Support <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: "Order Confirmation",
        react: (
          <PurchaseReceiptEmail
            order={order}
            product={{
              name: product.name,
              imagePath: product.imagePath,
              description: product.description,
            }}
            downloadVerificationId={downloadVerification.id}
          />
        ),
      });
    } else if (eventType === "payment.failed") {
      await db.order.updateMany({
        where: { razorpayOrderId },
        data: { status: false },
      });
    } else {
      console.log(`ℹ Ignoring event type: ${eventType}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new NextResponse("Webhook failed", { status: 500 });
  }
}
