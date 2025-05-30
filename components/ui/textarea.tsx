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
  ({ className, label, helperText, error, required, maxLength, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          onChange={handleChange}
          maxLength={maxLength}
          className={cn(
            "w-full min-h-[4rem] resize-y rounded-md border bg-white text-gray-800 dark:bg-gray-700 dark:text-white px-3 py-2 text-base shadow-sm transition focus:outline-none",
            "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={helperText ? `${props.id}-helper` : undefined}
          {...props}
        />
        {helperText && (
          <p id={`${props.id}-helper`} className="text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        {maxLength && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
            {charCount}/{maxLength} characters
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
