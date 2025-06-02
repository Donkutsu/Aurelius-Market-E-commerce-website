// app/api/razorpay/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import db from "@/lib/db"; // your Prisma client

export async function POST(request: NextRequest) {
  try {
    // 1) Read productId and email from the client’s JSON body
    const { productId, email } = (await request.json()) as {
      productId: string;
      email: string;
    };

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 2) Upsert the User by email (create if not exists, otherwise do nothing)
    const user = await db.user.upsert({
      where: { email },
      create: { email },
      update: {}, // no changes if already exists
      select: { id: true },
    });

    // 3) Ensure product exists & get price
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, priceInCents: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 4) Create a new “PROCESSING” Order in our DB
    const newOrder = await db.order.create({
      data: {
        productId: product.id,
        userId: user.id,                     // link to the upserted user
        status: "PROCESSING",
        pricePaidInCents: product.priceInCents,
        razorpayOrderId: "",                // placeholder
        razorpayPaymentId: "",
      },
      select: { id: true },
    });

    // 5) Initialize Razorpay server SDK
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // 6) Create an order in Razorpay (amount is in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: product.priceInCents,   // e.g. ₹500.00 → 50000 paise
      currency: "INR",
      receipt: `dbOrder_${newOrder.id}`,
      notes: {
        productId: product.id,
        orderId: newOrder.id,
      },
    });

    // 7) Update our DB Order with the Razorpay orderId
    await db.order.update({
      where: { id: newOrder.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    // 8) Return orderId + amount + currency + keyId
    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID!,
    });
  } catch (err) {
    console.error("Error in create-order:", err);
    return NextResponse.json(
      { error: "Unable to create order" },
      { status: 500 }
    );
  }
}
