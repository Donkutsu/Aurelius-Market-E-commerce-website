import {
  Body,
  Button as EmailButton,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components"
import { OrderInformation } from "./components/OrderInformation"

type PurchaseReceiptEmailProps = {
  product: {
    name: string
    imagePath: string
    description: string
  }
  order: { id: string; createdAt: Date; pricePaidInCents: number }
  downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
  product: {
    name: "Awesome Widget",
    description: "An amazing widget you just purchased.",
    imagePath: "/products/widget.jpg",
  },
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 2499,
  },
  downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps

export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  // Full download URL (adjust to your domain / env var)
  const downloadUrl =
    `${process.env.NEXT_PUBLIC_SERVER_URL}` +
    `/products/download/${downloadVerificationId}`

  return (
    <Html>
      <Preview>Your Purchase of {product.name} is Complete</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white text-black">
          <Container className="max-w-xl mx-auto p-4">
            {/* ─── Greeting & Thank You ───────────────────────────────────────── */}
            <Heading className="text-2xl font-bold mb-2">Hello,</Heading>
            <Text className="text-base mb-6">
              Thank you for your purchase! Below is your receipt and a link to
              download your product.
            </Text>

            {/* ─── Call‐to‐Action Button ───────────────────────────────────────── */}
            <div className="mb-6">
            <EmailButton
              href={downloadUrl}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold mb-6 inline-block"
            >
              Download Your Product
            </EmailButton>
            </div>
            <OrderInformation
              order={order}
              product={product}
              downloadVerificationId={downloadVerificationId}
            />

            <Text className="text-sm text-gray-600 mt-6">
              If you have any questions or need assistance, feel free to reply
              to this email or contact our support team at{" "}
              <a href="mailto:support@yourdomain.com" className="text-blue-600">
                support@yourdomain.com
              </a>
              .
            </Text>

            <Text className="text-xs text-gray-500 mt-8">
              Thank you for shopping with Aurelius Market. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
