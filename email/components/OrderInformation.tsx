import { formatCurrency } from "@/lib/formatters"
import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
  Link,
} from "@react-email/components"

type OrderInformationProps = {
  order: { id: string; createdAt: Date; pricePaidInCents: number }
  product: { imagePath: string; name: string; description: string }
  downloadVerificationId: string
}

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

export function OrderInformation({
  order,
  product,
  downloadVerificationId,
}: OrderInformationProps) {
  // Build the full download URL once
  const downloadUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/products/download/${downloadVerificationId}`

  return (
    <>
      <Section>
        <Row>
          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap mr-4">
              Order ID:
            </Text>
            <Text className="mt-0 mr-4 font-mono">{order.id}</Text>
          </Column>

          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap mr-4">
              Purchased On:
            </Text>
            <Text className="mt-0 mr-4">
              {dateFormatter.format(order.createdAt)}
            </Text>
          </Column>

          <Column>
            <Text className="mb-0 text-gray-500 whitespace-nowrap mr-4">
              Price Paid:
            </Text>
            <Text className="mt-0 mr-4">
              {formatCurrency(order.pricePaidInCents / 100)}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section className="border border-solid border-gray-300 rounded-lg p-4 md:p-6 my-4">
        <Img
          width="100%"
          height="auto"
          alt={product.name}
          src={`${process.env.NEXT_PUBLIC_SERVER_URL}${product.imagePath}`}
          className="rounded-md"
          style={{ display: "block", margin: "0 auto" }}
        />

        <Row className="mt-6">
          <Column>
            <Text className="text-lg font-bold m-0">{product.name}</Text>
          </Column>
          <Column align="right">
            {/* 
              Use Link for proper email‐client anchor styling.
              Added target="_blank" and rel="noopener noreferrer" 
            */}
            <Link href={downloadUrl} target="_blank" rel="noopener noreferrer">
              <Button
                className="bg-black text-white px-6 py-3 rounded text-base"
                style={{ textDecoration: "none" }}
                aria-label={`Download ${product.name}`}
              >
                Download
              </Button>
            </Link>
          </Column>
        </Row>

        <Row className="mt-4">
          <Column>
            <Text className="text-gray-500 mb-0">{product.description}</Text>
          </Column>
        </Row>
      </Section>
    </>
  )
}
