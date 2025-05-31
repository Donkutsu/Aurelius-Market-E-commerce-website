// app/api/razorpay/verify-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // 1) Parse the JSON body
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      (await request.json()) as {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
      };

    // 2) Recompute HMAC_SHA256(order_id + "|" + payment_id, RAZORPAY_KEY_SECRET)
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // 3) Compare to the signature sent by Razorpay
    const verified = generatedSignature === razorpaySignature;

    // 4) Optionally, you can mark the order as “paid” in your database here.

    // 5) Return a JSON object indicating verification result
    return NextResponse.json({ verified });
  } catch (err) {
    console.error("Error in verify-payment:", err);
    return NextResponse.json(
      { error: "Unable to verify payment. Please try again." },
      { status: 400 }
    );
  }
}
