"use client";

import { Nav, NavLink } from "@/components/Nav";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";

export const dynamic = "force-dynamic";

function InnerAdminLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent flash of wrong theme on hydration
    return null;
  }

  function toggleTheme() {
    // Toggles between light and dark using next-themes
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <div className="min-h-screen flex flex-col bg-primaryBg text-textPrimary">
      {/* Header */}
      <header className="bg-secondaryBg border-b border-borderBg px-6 py-4 backdrop-blur-sm shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-textHeading">
            Admin Dashboard
          </Link>

          <div className="flex items-center gap-6">
            <Nav className="flex gap-6">
              <NavLink href="/admin" className="text-textPrimary hover:text-accentBlue">
                Dashboard
              </NavLink>
              <NavLink href="/admin/products" className="text-textPrimary hover:text-accentBlue">
                Products
              </NavLink>
              <NavLink href="/admin/users" className="text-textPrimary hover:text-accentBlue">
                Customers
              </NavLink>
              <NavLink href="/admin/orders" className="text-textPrimary hover:text-accentBlue">
                Sales
              </NavLink>
            </Nav>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-bg-border hover:bg-borderBg transition-colors"
              aria-label="Toggle Dark/Light Mode"
            >
              {resolvedTheme === "light" ? (
                <Moon className="w-5 h-5 text-textPrimary" />
              ) : (
                <Sun className="w-5 h-5 text-textPrimary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <InnerAdminLayout>{children}</InnerAdminLayout>
    </ThemeProvider>
  );
}
