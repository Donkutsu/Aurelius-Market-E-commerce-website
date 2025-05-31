"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  description: string;
  imagePath: string | null;
  priceInCents: number;
};

type CheckoutFormProps = {
  product: Product;
  orderId: string;
  razorpayKey: string; // RAZORPAY_KEY_ID
};

export function CheckoutForm({
  product,
  orderId,
  razorpayKey,
}: CheckoutFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const razorpayRef = useRef<any>(null);

  // Load Razorpay checkout script on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => {
      console.error("Razorpay SDK failed to load.");
      setErrorMessage("Unable to load payment gateway. Please try again later.");
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle payment when "Pay" is clicked
  const handlePayment = () => {
    setErrorMessage(null);
    setIsProcessing(true);

    if (typeof (window as any).Razorpay !== "function") {
      setErrorMessage("Payment SDK failed to load. Try again later.");
      setIsProcessing(false);
      return;
    }

    const options = {
      key: razorpayKey,
      amount: product.priceInCents,
      currency: "INR",
      order_id: orderId,
      name: product.name,
      description: product.description,
      image: product.imagePath ?? "",
      handler: async (response: any) => {
        try {
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const data = await verifyRes.json();
          if (verifyRes.ok && data.verified) {
            router.push(`/razorpay/success?order_id=${response.razorpay_order_id}`);
          } else {
            setErrorMessage("Payment verification failed. Please contact support.");
          }
        } catch (err: unknown) {
          console.error("Error verifying Razorpay payment:", err);
          setErrorMessage("An error occurred while verifying payment.");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      notes: { productId: product.id },
      theme: { color: "#FF4500" },
    };

    razorpayRef.current = new (window as any).Razorpay(options);
    razorpayRef.current.open();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col md:flex-row max-w-3xl w-full overflow-hidden">
      {/* Product Image */}
      <div className="md:w-1/3 w-full h-64 md:h-auto relative bg-gray-100 dark:bg-gray-700">
        {product.imagePath ? (
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      {/* Details + Pay */}
      <div className="md:w-2/3 w-full p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h1>
          <div className="text-xl text-green-600 font-semibold mb-4">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-4">
            {product.description}
          </p>
        </div>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <Button
          onClick={handlePayment}
          className="bg-blue-600 text-white w-full rounded-xl px-6 py-3 font-semibold shadow-lg hover:bg-blue-700 transition-all duration-200"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? "Processing…" : `Pay ₹${(product.priceInCents / 100).toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}
