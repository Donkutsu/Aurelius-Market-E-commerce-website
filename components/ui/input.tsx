// components/ui/input.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  floating?: boolean;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, floating = false, ...props }, ref) => {
    // If you use floating labels, we need a placeholder—even if blank:
    const needsPlaceholder = floating ? { placeholder: ' ' } : {};
    return (
      <div className={cn(floating ? 'relative w-full' : 'w-full')}>
        <input
          {...needsPlaceholder}
          {...props}
          ref={ref}
          data-slot="input"
          className={cn(
            // Base: full-width, big text, bottom border only
            'w-full bg-transparent text-base md:text-lg px-2 py-3 outline-none transition-colors',
            'border-0 border-b-2 border-gray-600 focus:border-blue-500',
            // If floating, add peer for label
            floating && 'peer',
            className
          )}
        />
        {floating && label && (
          <label
            htmlFor={props.id}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 transition-all',
              'peer-placeholder-shown:text-base peer-placeholder-shown:top-1/2',
              'peer-focus:top-0 peer-focus:-translate-y-full peer-focus:text-sm peer-focus:text-blue-400'
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
