'use client';

import { Nav, NavLink } from "@/components/Nav";
import { ThemeProvider } from "@/components/theme-provider";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <header className="border-b border-gray-700 px-6 py-4 backdrop-blur-sm shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <Nav className="flex gap-6">
              <NavLink href="/admin">Dashboard</NavLink>
              <NavLink href="/admin/products">Products</NavLink>
              <NavLink href="/admin/users">Customers</NavLink>
              <NavLink href="/admin/orders">Sales</NavLink>
            </Nav>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>
      </div>

  );
}
