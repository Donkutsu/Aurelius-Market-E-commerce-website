"use server"

import db from "@/lib/db"

/**
 * Checks whether a user has a *completed* order for a specific product.
 * Later: Add cooldown (30 min) if needed for repeat purchases.
 */
export async function userOrderExists(userId: string, productId: string) {
  try {
    const existingOrder = await db.order.findFirst({
      where: {
        userId,
        productId,
        status: true, // only count fully paid orders
        // 🔒 Future idea: Add a cooldown check like:
        createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) }
      },
      select: { id: true },
    });

    return existingOrder != null;
  } catch (err) {
    console.error("🔴 userOrderExists error:", err);
    throw new Error("⚠️ Could not check prior purchase. Try again later.");
  }
}
