
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import db from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  // Validate ID
  if (!id || typeof id !== "string") return notFound();

  // Fetch file details from DB
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  });

  if (!product?.filePath) return notFound();

  try {
    const filePath = path.resolve(product.filePath); // Prevent directory traversal attacks
    const fileStat = await fs.stat(filePath);
    const fileBuffer = await fs.readFile(filePath);

    const ext = path.extname(filePath).replace('.', '') || 'bin';
    const safeName = product.name.replace(/[^a-z0-9_\-]/gi, '_'); // sanitize filename

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${safeName}.${ext}"`,
        "Content-Length": fileStat.size.toString(),
        "Content-Type": "application/octet-stream", // Optional: better set if you know the MIME
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("File read error:", err);
    return new NextResponse("Failed to download file", { status: 500 });
  }
}
