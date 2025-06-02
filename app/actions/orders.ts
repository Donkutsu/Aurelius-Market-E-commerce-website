"use server";

import db from "@/lib/db";

/**
 * Check if a user has an order for `productId` that is either:
 *   - COMPLETED (they’ve already bought it), or
 *   - PROCESSING (an in-progress payment) created in the last 30 minutes.
 */
export async function userOrderExists(
  email: string,
  productId: string
): Promise<boolean> {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const existing = await db.order.findFirst({
    where: {
      user: { email },       // join on user by email
      productId,             // same product
      status: {
        in: ["PROCESSING", "COMPLETED"], // block if processing or already done
      },
      createdAt: {
        gte: thirtyMinutesAgo, // only consider recent processing orders
      },
    },
    select: { id: true },
  });

  return existing != null;
}
