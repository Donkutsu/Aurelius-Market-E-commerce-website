"use server"

import db from "@/lib/db"
import OrderHistoryEmail from "@/email/OrderHistory"
import { Resend } from "resend"
import { z } from "zod"

const emailSchema = z.string().email()
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  // 1️⃣ Validate that “email” exists and is a real email
  const raw = formData.get("email")
  const emailCandidate = typeof raw === "string" ? raw.trim() : ""
  const result = emailSchema.safeParse(emailCandidate)
  if (!result.success) {
    return { error: "Invalid email address" }
  }
  const userEmail = result.data

  try {
    const user = await db.user.findUnique({
      where: { email: userEmail },
      select: {
        email: true,
        orders: {
          where: { status: true }, // only completed orders
          select: {
            id: true,
            createdAt: true,
            pricePaidInCents: true,
            product: {
              select: {
                id: true,
                name: true,
                imagePath: true,
                description: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user || user.orders.length === 0) {
      return {
        message:
          "We couldn’t find any completed orders for that email. If you think this is a mistake, double-check your address or contact support.",
      }
    }

    const enriched = await Promise.all(
      user.orders.map(async (order) => {
        // a) Try to find an existing, non‐expired token for that product
        const existing = await db.downloadVerification.findFirst({
          where: {
            productId: order.product.id,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
          select: { id: true, expiresAt: true },
        })

        if (existing) {
          return {
            ...order,
            downloadVerificationId: existing.id,
          }
        }

        // b) Otherwise create a fresh 24‐hour token
        const dv = await db.downloadVerification.create({
          data: {
            productId: order.product.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        })
        return {
          ...order,
          downloadVerificationId: dv.id,
        }
      })
    )

    const emailResult = await resend.emails.send({
      from: `Support <${process.env.SENDER_EMAIL}>`,
      to: user.email,
      subject: "Your Order History & Download Links",
      react: <OrderHistoryEmail orders={enriched} />,
    })

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error)
      return { error: "There was a problem sending your email. Please try again later." }
    }

    return {
      message:
        "Success! We’ve emailed you your order history and download links. Check your inbox.",
    }
  } catch (err) {
    console.error("emailOrderHistory error:", err)
    return { error: "Something went wrong. Please try again later." }
  }
}
