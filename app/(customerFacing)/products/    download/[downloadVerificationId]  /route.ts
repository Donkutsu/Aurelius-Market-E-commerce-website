// app/(customerFacing)/products/download/[downloadVerificationId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs/promises";

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  // 1️⃣ Look up the download token and ensure it hasn’t expired
  const dv = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId },
    select: {
      productId: true,
      expiresAt: true,
    },
  });

  // If no token or already expired → redirect to “expired” page
  if (!dv || dv.expiresAt.getTime() <= Date.now()) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }

  // 2️⃣ Confirm there is at least one COMPLETED order for this product
  const completedOrder = await db.order.findFirst({
    where: {
      productId: dv.productId,
      status: "COMPLETED",
    },
    select: { id: true },
  });

  // If no completed order found → treat as unauthorized/expired
  if (!completedOrder) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }

  // 3️⃣ Fetch the product’s filePath and name
  const product = await db.product.findUnique({
    where: { id: dv.productId },
    select: { filePath: true, name: true },
  });

  if (!product) {
    // If product was somehow deleted, also redirect
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }

  // 4️⃣ Read the file from disk and stream it
  try {
    const { size } = await fs.stat(product.filePath);
    const fileBuffer = await fs.readFile(product.filePath);
    const extension = product.filePath.split(".").pop() || "bin";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
        "Content-Length": size.toString(),
      },
    });
  } catch (err: any) {
    console.error("File read error:", err);
    // If the file is missing or unreadable, treat as expired (or return 404)
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }
}
