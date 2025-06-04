// app/(customerFacing)/products/download/[downloadVerificationId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  { params: { downloadVerificationId } }: { params: { downloadVerificationId: string } }
) {
  // 1️⃣ Look up a non-expired download token
  const dv = await db.downloadVerification.findFirst({
    where: {
      id: downloadVerificationId,
      expiresAt: { gt: new Date() },
    },
    select: { productId: true },
  });
  if (!dv) {
    // If no token or expired, redirect to your “expired” page
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }

  // 2️⃣ Ensure there’s a completed (status = true) order for this product
  const completedOrder = await db.order.findFirst({
    where: {
      productId: dv.productId,
      status: true,
    },
    select: { id: true },
  });
  if (!completedOrder) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }

  // 3️⃣ Fetch the product’s filePath and name
  const product = await db.product.findUnique({
    where: { id: dv.productId },
    select: { filePath: true, name: true },
  });
  if (!product) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }

  // 4️⃣ Read and stream the file
  try {
    const filePath = path.resolve(product.filePath);
    const { size } = await fs.stat(filePath);
    const fileBuffer = await fs.readFile(filePath);

    const ext = path.extname(filePath).replace(".", "") || "bin";
    const safeName = product.name.replace(/[^a-z0-9_\-]/gi, "_");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${safeName}.${ext}"`,
        "Content-Length": size.toString(),
        "Content-Type": "application/octet-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("File read error:", err);
    return NextResponse.redirect(new URL("/products/download/expired", req.url));
  }
}
