'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav
      className={cn(
        'bg-secondaryBg text-textPrimary flex flex-wrap justify-center gap-4 rounded-lg p-4 shadow-md transition-shadow duration-300 hover:shadow-lg'
      )}
    >
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
        // Base styles
        'rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200',
        // Hover state: use borderBg for subtle background
        'hover:bg-bg-border hover:text-textHeading focus-visible:ring-2 focus-visible:ring-accentBlue',
        // Active state: bg-bg-border + text-heading + shadow
        isActive
          ? 'bg-bg-border text-textHeading shadow-md'
          : 'text-textPrimary',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
