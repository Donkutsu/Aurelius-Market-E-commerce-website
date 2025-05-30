'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Product } from '@/app/generated/prisma';
import { formatCurrency } from '@/lib/formatters';
import { addProduct } from '../../_actions/Products';
import { Label } from '@radix-ui/react-label';

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useActionState(addProduct, {});
  const [priceInCents, setPriceInCents] = useState<number | string>(product?.priceInCents || "");
  const { pending } = useFormStatus();

  return (
    <form
      action={action}
      className="bg-white text-gray-800 max-w-4xl mx-auto p-8 space-y-6 rounded-lg shadow-lg transition-all duration-300"
    >
      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name" className="block text-lg font-semibold">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={product?.name}
          className="bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        {error.name && (
          <p className="text-red-500 text-sm">{error.name}</p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-1">
        <Label htmlFor="priceInCents" className="block text-lg font-semibold">
          Price
        </Label>
        <div className="flex items-center gap-4">
          <Input
            id="priceInCents"
            name="priceInCents"
            type="number"
            required
            value={priceInCents}
            onChange={e => setPriceInCents(e.target.value)}
            className="bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <span className="text-gray-600">
            {formatCurrency((Number(priceInCents) || 0) / 100)}
          </span>
        </div>
        {error.priceInCents && (
          <p className="text-red-500 text-sm">{error.priceInCents}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description" className="block text-lg font-semibold">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ''}
          className="bg-gray-100 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 resize-none"
          rows={4}
        />
        {error.description && (
          <p className="text-red-500 text-sm">{error.description}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-1">
        <Label htmlFor="file" className="block text-lg font-semibold">
          File
        </Label>
        <Input
          id="file"
          name="file"
          type="file"
          required={!product}
          className="text-gray-600"
        />
        {product && (
          <p className="text-gray-500 text-sm">{product.filePath}</p>
        )}
        {error.file && (
          <p className="text-red-500 text-sm">{error.file}</p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-1">
        <Label htmlFor="image" className="block text-lg font-semibold">
          Image
        </Label>
        <Input
          id="image"
          name="image"
          type="file"
          required={!product}
          className="text-gray-600"
        />
        {product && (
          <Image
            src={product.imagePath}
            alt="Product"
            width={400}
            height={300}
            className="rounded-md border border-gray-300"
          />
        )}
        {error.image && (
          <p className="text-red-500 text-sm">{error.image}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full py-3 text-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
      >
        {pending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
