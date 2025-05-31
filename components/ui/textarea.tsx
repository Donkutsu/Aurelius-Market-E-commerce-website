// components/ui/textarea.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, helperText, error, required, maxLength, ...props },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-textHeading"
          >
            {label}
            {required && <span className="text-accentRed ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          onChange={handleChange}
          maxLength={maxLength}
          className={cn(
            "w-full min-h-[4rem] resize-y rounded-md bg-secondaryBg text-textPrimary px-3 py-2 shadow-sm transition-colors outline-none",
            // Border color depends on error or normal
            hasError
              ? "border border-accentRed focus:border-accentRed focus:ring-accentRed/40"
              : "border border-borderBg focus:border-accentBlue focus:ring-accentBlue/40",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        {helperText && (
          <p
            id={`${props.id}-helper`}
            className="text-sm text-textPrimary/60"
          >
            {helperText}
          </p>
        )}
        {maxLength && (
          <p className="text-sm text-textPrimary/60 text-right">
            {charCount}/{maxLength} characters
          </p>
        )}
        {hasError && (
          <p className="text-sm text-accentRed">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
