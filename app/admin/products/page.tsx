import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import db from "@/lib/db";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductActions";

export default async function AdminProductsPage() {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto bg-secondaryBg rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <PageHeader className="text-2xl font-bold text-textHeading">Products</PageHeader>
        <Button variant="adminAction" className="px-4 py-2 text-sm font-medium" asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      {/* Table of products */}
      <ProductsTable />
    </div>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailable: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-borderBg bg-secondaryBg shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondaryBg text-textHeading">
            <TableHead className="w-0">
              <span className="sr-only">Available</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-textPrimary/60 py-6">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="bg-secondaryBg hover:bg-bg-border/40 transition-colors">
                <TableCell className="w-0">
                  {product.isAvailable ? (
                    <>
                      <span className="sr-only">Available</span>
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      <span className="sr-only">Unavailable</span>
                      <XCircle className="text-red-500 h-5 w-5" />
                    </>
                  )}
                </TableCell>
                <TableCell className="font-medium text-textHeading">{product.name}</TableCell>
                <TableCell className="text-textPrimary">
                  {formatCurrency(product.priceInCents / 100)}
                </TableCell>
                <TableCell className="text-textPrimary">{product._count.orders}</TableCell>
                <TableCell className="w-0 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4 text-textPrimary" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-secondaryBg border border-borderBg">
                      <DropdownMenuItem asChild>
                        <a
                          href={`/admin/products/${product.id}/download`}
                          download
                          className="w-full text-textPrimary hover:text-accentBlue"
                        >
                          Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${product.id}/edit`} className="text-textPrimary hover:text-accentBlue">
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <ActiveToggleDropdownItem
                        id={product.id}
                        isAvailableForPurchase={product.isAvailable}
                      />
                      <DeleteDropdownItem
                        id={product.id}
                        disabled={product._count.orders > 0}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
