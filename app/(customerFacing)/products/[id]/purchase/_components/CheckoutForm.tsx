"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { formatCurrency } from "@/lib/formatters";

// Add Razorpay type to window
declare global {
  interface Window {
    Razorpay?: any;
  }
}


type CheckoutFormProps = {
  product: {
    id: string;
    name: string;
    priceInCents: number;
    imagePath: string;
    description: string;
  };
  orderId: string;      // Razorpay order ID returned from server
};

export default function CheckoutForm({ product, orderId }: CheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  }, []);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handlePayment = async () => {
    if (!isEmailValid || !scriptLoaded) return;
    setIsLoading(true);
    setError(null);

    const options: any = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // your Razorpay Key ID (public)
      amount: product.priceInCents,                  // in paise
      currency: "INR",
      name: "Your Store Name",                       // shown at top of checkout form
      description: product.name,
      order_id: orderId,                             // Razorpay order ID from server
      prefill: {
        email: email.trim(),
      },
      theme: {
        color: "#1f2937",        // e.g. a dark gray (#1f2937) or any hex you prefer
        backdrop_color: "#000000", // a blackish backdrop
      },
      handler: async (response: any) => {
        // 4️⃣ On success: call our Next.js API to verify & store
        try {
          await axios.post("/api/verify-purchase", {
            email: email.trim(),
            productId: product.id,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          // If no error, redirect or show success
          window.location.href = "/purchase-success";
        } catch (err: any) {
          console.error(err);
          setError(
            err.response?.data?.error || "Verification failed"
          );
        } finally {
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
        },
      },
    };

    // 5️⃣ Open Razorpay checkout
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex gap-4 items-center">
        <div className="aspect-video w-1/3 relative">
          <Image
            src={product.imagePath}
            fill
            alt={product.name}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          Your email (required)
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        onClick={handlePayment}
        disabled={!isEmailValid || isLoading || !scriptLoaded}
        className={`w-full px-6 py-3 text-white font-semibold rounded-md ${
          !isEmailValid || isLoading || !scriptLoaded
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-sky-600 hover:bg-sky-700"
        }`}
      >
        {isLoading ? "Processing…" : `Pay ₹${(product.priceInCents / 100).toFixed(2)}`}
      </button>
    </div>
  );
}
