"use server";

import db from "@/lib/db";
import { notFound } from "next/navigation";

// Actions for managing orders in the admin panel
export async function deleteOrder(id: string) {
  try {
    const order = await db.order.delete({
      where: { id },
    });

    if (!order) return notFound();

    return {
      success: true,
      message: "Order deleted successfully",
      data: { id: order.id },
    };
  } catch (error) {
    console.error("Failed to delete order:", error);
    return {
      success: false,
      message: "Failed to delete order",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
