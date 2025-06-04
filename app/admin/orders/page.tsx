import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";
import { formatCurrency } from "@/lib/formatters";
import { PageHeader } from "../_components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteDropDownItem } from "./    _components/UserActions";

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      createdAt: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default function OrdersPage() {
  return (
    <>
      <PageHeader>Sales</PageHeader>
      <OrdersTable />
    </>
  );
}

async function OrdersTable() {
  const orders = await getOrders();

  if (orders.length === 0)
    return (
      <div className="mt-6 text-center text-muted-foreground">
        No sales found.
      </div>
    );

  return (
    <Card className="mt-6 shadow-lg border-borderBg">
      <CardHeader>
        <CardTitle className="text-lg text-textHeading">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto rounded-md">
        <Table className="min-w-full">
          <TableHeader className="bg-secondaryBg sticky top-0 z-10">
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Price Paid</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>tr:nth-child(even)]:bg-bg-border/40">
            {orders.map((order) => (
              <TableRow
                key={order.id}
                className="hover:bg-bg-border/60 transition-colors"
              >
                <TableCell>{order.product.name}</TableCell>
                <TableCell className="text-sm text-textPrimary">
                  {order.user.email}
                </TableCell>
                <TableCell className="text-accentBlue font-semibold">
                  {formatCurrency(order.pricePaidInCents / 100)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 rounded-full hover:bg-borderBg">
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-secondaryBg">
                      <DeleteDropDownItem id={order.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
