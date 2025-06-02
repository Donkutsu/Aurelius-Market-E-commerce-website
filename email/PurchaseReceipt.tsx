// app/email/PurchaseReceipt.tsx

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Tailwind,
  Text,
  Button,
} from "@react-email/components";

// Helper to format rupees (₹) using Intl.NumberFormat
function formatINR(amountInCents: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountInCents / 100);
}

type PurchaseReceiptEmailProps = {
  product: {
    name: string;
    imagePath: string;
    description: string;
  };
  order: {
    id: string;
    createdAt: Date;
    pricePaidInCents: number;
  };
  downloadVerificationId: string;
};

export const PurchaseReceiptEmail = ({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) => {
  return (
    <Html>
      <Preview>Thank you for purchasing “{product.name}”</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white p-4">
          <Container className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* ─── Header ─────────────────────────────────────────────── */}
            <div className="bg-accentBlue px-6 py-4">
              <Heading className="text-white">Purchase Confirmation</Heading>
            </div>

            {/* ─── Product Image ─────────────────────────────────────── */}
            <div className="p-6 flex flex-col md:flex-row items-center gap-4">
              <div className="w-full md:w-1/3">
                <Img
                  src={product.imagePath}
                  alt={product.name}
                  width="100%"
                  height="auto"
                  className="rounded-md object-cover"
                />
              </div>

              {/* ─── Product & Order Details ──────────────────────── */}
              <div className="flex-1 space-y-3">
                <Text className="text-lg font-semibold text-gray-800">
                  {product.name}
                </Text>
                <Text className="text-sm text-gray-600 line-clamp-3">
                  {product.description}
                </Text>

                <div className="mt-4 space-y-1">
                  <Text className="text-sm text-gray-700">
                    <span className="font-medium">Order ID:</span> {order.id}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    <span className="font-medium">Date:</span>{" "}
                    {order.createdAt.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                  <Text className="text-sm text-gray-700">
                    <span className="font-medium">Amount Paid:</span>{" "}
                    {formatINR(order.pricePaidInCents)}
                  </Text>
                </div>
              </div>
            </div>

            {/* ─── Download Button ─────────────────────────────────── */}
            <div className="p-6 text-center">
              <Button
                className="bg-accentRed text-white px-6 py-3 rounded-lg font-semibold hover:bg-accentRed/80 transition-colors duration-200"
                href={`https://your‐domain.com/products/download/${downloadVerificationId}`}
              >
                Download Now
              </Button>
            </div>

            {/* ─── Footer Notes ────────────────────────────────────── */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <Text className="text-xs text-gray-500">
                This link will expire in 24 hours. If you encounter any
                issues, please reply to this email or contact our support team.
              </Text>
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Sample Product Name",
    description: "A brief description of the sample product goes here.",
    imagePath:
      "https://via.placeholder.com/300x200.png?text=Product+Image",
  },
  order: {
    id: "order_1234abcd",
    createdAt: new Date(),
    pricePaidInCents: 9999,
  },
  downloadVerificationId: "dv_abcdef123456",
} satisfies PurchaseReceiptEmailProps;

export default PurchaseReceiptEmail;
