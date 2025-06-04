// app/(customerFacing)/products/[id]/purchase/_components/CheckoutForm.tsx
"use client";

import { ProductCard } from "@/components/ProductCard";
import Image from "next/image";
import { useState, useEffect } from "react";

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
  orderId: string; // Razorpay order ID generated server‐side in page.tsx
};

export default function CheckoutForm({ product, orderId }: CheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 1️⃣ Dynamically load Razorpay SDK
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

  const handlePayment = () => {
    if (!isEmailValid || !scriptLoaded) return;
    setError(null);
    setIsLoading(true);

    const options: any = {
      key: "rzp_test_7DlB96CN3J6lWy", // public key only
      amount: product.priceInCents,                 // in paise
      currency: "INR",
      name: "Aurelius Market",
      description: product.name,
      order_id: orderId,                            // from server
      prefill: {
        email: email.trim(),
      },
      theme: {
        color: "#1f2937",
        backdrop_color: "#000000",
      },
      handler: (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        // 4️⃣ On successful payment, redirect to success page
        //    Webhook at /api/webhooks/razorpay will handle DB insertion & verification
        window.location.href = `/razorpay/purchase-success?order_id=${response.razorpay_order_id}&email=${encodeURIComponent(
          email.trim()
        )}`;
      },
      modal: {
        ondismiss: () => {
          // User closed the popup before completing payment
          setIsLoading(false);
          setError("Payment cancelled. Please try again if you wish to complete the purchase.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
  <div className="max-w-2xl mx-auto space-y-8">
    {/* --------------- Product Info --------------- */}
    <div className="flex gap-4 items-center">
      <div className="aspect-video flex-shrink-0 w-1/3 relative rounded-xl overflow-hidden shadow-lg">
        <Image
          src={product.imagePath}
          fill
          alt={product.name}
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div>
        <div className="text-green-600 text-lg font-semibold">
          ₹{(product.priceInCents / 100).toFixed(2)}
        </div>
        <h1 className="text-yellow-500 text-2xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground line-clamp-3">
          {product.description}
        </p>
      </div>
    </div>

    {/* --------------- Email Input --------------- */}
    <div className="mt-6">
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

    {/* --------------- Error Message --------------- */}
    {error && <p className="text-sm text-red-600">{error}</p>}

    {/* --------------- Purchase Button --------------- */}
    <button
      onClick={handlePayment}
      disabled={!isEmailValid || isLoading || !scriptLoaded}
      className={`w-full px-6 py-3 text-white font-semibold rounded-md transition-all duration-300 ${
        !isEmailValid || isLoading || !scriptLoaded
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-sky-600 hover:bg-sky-700"
      }`}
    >
      {isLoading
        ? "Redirecting to payment…"
        : `Pay ₹${(product.priceInCents / 100).toFixed(2)}`}
    </button>
  </div>
);
}
// This component handles the checkout form for purchasing a product
// It dynamically loads the Razorpay SDK, collects user email, and initiates payment
