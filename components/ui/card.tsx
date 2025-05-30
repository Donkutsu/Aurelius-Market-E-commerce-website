"use client";

import * as React from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type Order = {
  id: string;
  customer: string;
  product: { name: string; imageUrl: string };
  amount: number;
  date: string;
  status: "active" | "inactive";
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-muted bg-black/30 backdrop-blur-sm shadow-lg">
      <Table className="table-auto w-full">
        <TableHeader className="sticky top-0 bg-black/90 backdrop-blur px-4">
          <TableRow>
            <TableHead className="pl-6">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&>tr:nth-child(even)]:bg-muted/20">
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-muted/40">
              <TableCell className="pl-6 font-mono text-xs text-foreground">
                {order.id}
              </TableCell>

              <TableCell>{order.customer}</TableCell>

              <TableCell className="flex items-center gap-2">
                <img
                  src={order.product.imageUrl}
                  alt={order.product.name}
                  className="h-8 w-8 rounded object-cover border border-white/20"
                />
                <span>{order.product.name}</span>
              </TableCell>

              <TableCell className="text-primary font-semibold">
                ₹{order.amount.toFixed(2)}
              </TableCell>

              <TableCell className="text-sm text-muted-foreground">
                {order.date}
              </TableCell>

              <TableCell>
                <span
                  className={cn(
                    "inline-block rounded-full px-3 py-1 text-xs font-medium",
                    order.status === "active"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  )}
                >
                  {order.status === "active" ? "Active" : "Inactive"}
                </span>
              </TableCell>

              <TableCell className="pr-6 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded hover:bg-white/10">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Actions</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/orders/${order.id}/edit`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive hover:bg-destructive/80"
                      onClick={() => {
                        /* your delete logic */
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
