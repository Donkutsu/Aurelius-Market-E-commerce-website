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
    <div className="overflow-x-auto rounded-2xl border border-borderBg bg-secondaryBg shadow-lg">
      <Table className="table-auto w-full">
        <TableHeader className="sticky top-0 bg-secondaryBg/95 backdrop-blur px-4">
          <TableRow>
            <TableHead className="pl-6 text-textHeading">Order ID</TableHead>
            <TableHead className="text-textHeading">Customer</TableHead>
            <TableHead className="text-textHeading">Product</TableHead>
            <TableHead className="text-textHeading">Amount</TableHead>
            <TableHead className="text-textHeading">Date</TableHead>
            <TableHead className="text-textHeading">Status</TableHead>
            <TableHead className="pr-6 text-right text-textHeading">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&>tr:nth-child(even)]:bg-bg-border/40">
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="hover:bg-bg-border/60 transition-colors"
            >
              <TableCell className="pl-6 font-mono text-xs text-textPrimary">
                {order.id}
              </TableCell>

              <TableCell className="text-textPrimary">
                {order.customer}
              </TableCell>

              <TableCell className="flex items-center gap-2 text-textPrimary">
                <img
                  src={order.product.imageUrl}
                  alt={order.product.name}
                  className="h-8 w-8 rounded object-cover border border-borderBg"
                />
                <span>{order.product.name}</span>
              </TableCell>

              <TableCell className="text-accentBlue font-semibold">
                ₹{order.amount.toFixed(2)}
              </TableCell>

              <TableCell className="text-sm text-textPrimary">
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
                    <button className="p-2 rounded-full bg-bg-border hover:bg-borderBg transition-colors">
                      <MoreVertical className="h-4 w-4 text-textPrimary" />
                      <span className="sr-only">Actions</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-secondaryBg border border-borderBg">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/orders/${order.id}`} className="text-textPrimary hover:text-accentBlue">
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/orders/${order.id}/edit`} className="text-textPrimary hover:text-accentBlue">
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-accentRed hover:bg-accentRed/10"
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
