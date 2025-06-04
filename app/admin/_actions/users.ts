// users.ts
"use server";

import db from "@/lib/db";
import { notFound } from "next/navigation";

export async function deleteUser(id: string) {
  try {
    const user = await db.user.delete({
      where: { id },
    });

    if (!user) return notFound();

    return {
      success: true,
      message: "User deleted successfully",
      data: { id: user.id },
    };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return {
      success: false,
      message: "Failed to delete user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
