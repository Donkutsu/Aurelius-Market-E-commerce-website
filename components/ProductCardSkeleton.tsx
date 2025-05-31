// components/ProductCardSkeleton.tsx
import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-secondaryBg rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="h-48 w-full bg-bg-border" />

      {/* Text & Button Placeholders */}
      <div className="p-6 flex flex-col">
        <div className="h-6 bg-bg-border rounded w-3/4 mb-2" />
        <div className="h-4 bg-bg-border rounded w-full mb-4" />
        <div className="h-4 bg-bg-border rounded w-5/6 mb-6" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-bg-border rounded w-16" />
          <div className="h-8 bg-bg-border rounded w-20" />
        </div>
      </div>
    </div>
  );
}
