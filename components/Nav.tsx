'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, ReactNode } from 'react';

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex flex-wrap justify-center gap-4 rounded-lg p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
      {children}
    </nav>
  );
}

type NavLinkProps = {
  href: string;
  exact?: boolean;
  className?: string;
  children: ReactNode;
};

export function NavLink({
  href,
  exact = false,
  className,
  children,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        'rounded-lg px-4 py-2 transition-colors duration-200 text-sm font-medium',
        'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 focus-visible:ring-2 focus-visible:ring-gray-300',
        isActive ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md' : 'text-gray-600 dark:text-gray-300',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
