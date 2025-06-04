// app/admin/users/page.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { PageHeader } from "../_components/PageHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteDropDownItem } from "./_components/UserActions";
import { cn } from "@/lib/utils";

function getUsers() {
  return db.user.findMany({
    select: {
      id: true,
      email: true,
      orders: { select: { pricePaidInCents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default function UsersPage() {
  return (
    <>
      <PageHeader>Customers</PageHeader>
      <UsersTable />
    </>
  );
}

async function UsersTable() {
  const users = await getUsers();

  if (users.length === 0)
    return (
      <div className="mt-8 rounded-lg border border-borderBg bg-secondaryBg p-6 text-center text-textPrimary/60">
        No customers found.
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-borderBg bg-secondaryBg shadow-lg">
      <Table className="w-full table-auto">
        <TableHeader className="sticky top-0 bg-secondaryBg/95 backdrop-blur px-4">
          <TableRow>
            <TableHead className="pl-6 text-textHeading">Email</TableHead>
            <TableHead className="text-textHeading">Orders</TableHead>
            <TableHead className="text-textHeading">Value</TableHead>
            <TableHead className="pr-6 text-right text-textHeading">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="[&>tr:nth-child(even)]:bg-borderBg/40">
          {users.map((user) => {
            const totalValue =
              user.orders.reduce((sum, o) => sum + o.pricePaidInCents, 0) /
              100;

            return (
              <TableRow
                key={user.id}
                className="transition-colors hover:bg-borderBg/60"
              >
                <TableCell className="pl-6 text-textPrimary">
                  {user.email}
                </TableCell>

                <TableCell className="text-accentBlue font-semibold">
                  {formatNumber(user.orders.length)}
                </TableCell>

                <TableCell className="text-accentGreen font-medium">
                  {formatCurrency(totalValue)}
                </TableCell>

                <TableCell className="pr-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full bg-bg-border p-2 hover:bg-borderBg transition-colors">
                        <MoreVertical className="h-4 w-4 text-textPrimary" />
                        <span className="sr-only">Actions</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-secondaryBg border border-borderBg">
                      <DeleteDropDownItem id={user.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
