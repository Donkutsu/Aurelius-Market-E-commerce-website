// app/api/razorpay/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    };

    console.log("🔔 verify-payment payload:", body);
    console.log("🔑 Using secret:", process.env.RAZORPAY_KEY_SECRET);

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    // 1) Recompute the HMAC SHA256 as Razorpay expects
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    console.log("ℹ️ generatedSignature:", generatedSignature);
    console.log("ℹ️ razorpaySignature:", razorpaySignature);

    const verified = generatedSignature === razorpaySignature;
    console.log("✅ signature match?", verified);

    // 2) Look up your DB order by razorpayOrderId
    const existingOrder = await db.order.findUnique({
      where: { razorpayOrderId },
      select: { id: true },
    });
    if (!existingOrder) {
      console.error("⛔️ Order not found:", razorpayOrderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3) Update DB: COMPLETED or FAILED
    await db.order.update({
      where: { razorpayOrderId },
      data: verified
        ? { status: "COMPLETED", razorpayPaymentId }
        : { status: "FAILED" },
    });

    // 4) Respond to the client
    return NextResponse.json({ verified });
  } catch (err) {
    console.error("🔥 Error in verify-payment:", err);
    return NextResponse.json(
      { error: "Unable to verify payment. Please try again." },
      { status: 400 }
    );
  }
}
