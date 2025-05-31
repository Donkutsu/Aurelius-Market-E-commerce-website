// components/ui/FloatingInput.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@radix-ui/react-label';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | string[];
}

export function FloatingInput({
  label,
  id,
  error,
  className,
  ...props
}: FloatingInputProps) {
  const inputId = id ?? React.useId();
  const hasError = Boolean(error);

  return (
    <div className={cn('relative w-full', className)}>
      {/* Actual input: transparent placeholder to enable peer-placeholder-shown */}
      <input
        id={inputId}
        placeholder=" "
        className={cn(
          'peer h-12 w-full rounded-md border bg-secondaryBg px-3 pt-4 pb-1 text-textPrimary outline-none transition-colors',
          // Standard border color, or red if error
          hasError ? 'border-accentRed focus:border-accentRed' : 'border-borderBg focus:border-accentBlue',
          // On focus, label moves—handled by label classes
          'placeholder-transparent',
        )}
        {...props}
      />

      {/* Floating label */}
      <LabelPrimitive.Root
        htmlFor={inputId}
        className={cn(
          'absolute left-3 z-10 origin-[0_0] px-1 bg-secondaryBg transition-all',
          // Inactive: slightly muted color, positioned lower and larger
          'peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-textPrimary/60',
          // On focus or filled: move up, shrink, and change color (red if error)
          hasError
            ? 'peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-sm peer-focus:text-accentRed'
            : 'peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-sm peer-focus:text-accentBlue',
        )}
      >
        {label}
      </LabelPrimitive.Root>

      {/* Error message */}
      {hasError && (
        <p className="mt-1 text-sm text-accentRed">
          {Array.isArray(error) ? error.join(', ') : error}
        </p>
      )}
    </div>
  );
}

FloatingInput.displayName = 'FloatingInput';
