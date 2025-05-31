'use client';

import { Nav, NavLink } from "@/components/Nav";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-primaryBg text-textPrimary">
      <header className="bg-secondaryBg border-b border-borderBg px-6 py-4 backdrop-blur-sm shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-textHeading">
            Aurelius Market
          </Link>

          <div className="flex items-center gap-6">
            <Nav className="flex gap-6">
              <NavLink href="/" className="text-textPrimary hover:text-accentBlue">
                Home
              </NavLink>
              <NavLink href="/products" className="text-textPrimary hover:text-accentBlue">
                Products
              </NavLink>
              <NavLink href="/users" className="text-textPrimary hover:text-accentBlue">
                My Orders
              </NavLink>
            </Nav>

            <button
              onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
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

      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
