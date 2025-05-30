// components/ui/FloatingInput.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@radix-ui/react-label';

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
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

  return (
    <div className={cn('relative w-full', className)}>
      {/* the actual input: transparent placeholder to enable “peer-placeholder-shown” */}
      <input
        id={inputId}
        placeholder=" "
        className={cn(
          'peer h-12 w-full rounded-md border border-gray-600 bg-[#121212] px-3 pt-4 pb-1 text-white outline-none transition-colors',
          'focus:border-blue-500',
          error && 'border-red-500 focus:border-red-400',
          'placeholder-transparent'
        )}
        {...props}
      />

      {/* floating label */}
      <LabelPrimitive.Root
        htmlFor={inputId}
        className={cn(
          'absolute left-3 top-3 z-10 origin-[0_0] -translate-y-1/2 transform text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-3 peer-focus:text-sm peer-focus:text-white'
        )}
      >
        {label}
      </LabelPrimitive.Root>

      {/* error message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {Array.isArray(error) ? error.join(', ') : error}
        </p>
      )}
    </div>
  );
}
