'use client';

import React, { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Product } from '@/app/generated/prisma';
import { formatCurrency } from '@/lib/formatters';
import { addProduct } from '../../_actions/Products';
import { Label } from '@radix-ui/react-label';

const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ProductForm({ product }: { product?: Product | null }) {
  const [error, action] = useActionState(addProduct, {});
  const [priceInCents, setPriceInCents] = useState<number | string>(product?.priceInCents || '');
  const [fileError, setFileError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const { pending } = useFormStatus();

  // Validate file type on file input change
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const file = e.target.files?.[0];
    if (file && !ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError('Unsupported file type. Please upload a PDF or Word document.');
      e.target.value = ''; // Reset file input
    }
  }

  // Validate image type on image input change
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError(null);
    const file = e.target.files?.[0];
    if (file && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError('Unsupported image type. Please upload JPG, PNG, or WEBP images.');
      e.target.value = '';
    }
  }

  return (
    <form
      action={action}
      className="bg-secondaryBg text-textPrimary max-w-4xl mx-auto p-8 space-y-8 rounded-2xl shadow-lg transition-all duration-300"
      noValidate
    >
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="block text-lg font-semibold text-textHeading">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          aria-invalid={!!error.name}
          aria-describedby={error.name ? "name-error" : undefined}
          defaultValue={product?.name}
          className={`transition border rounded-md focus:outline-none focus:ring-2 focus:ring-accentBlue ${
            error.name ? 'border-accentRed' : 'border-borderBg'
          }`}
        />
        {error.name && (
          <p id="name-error" className="text-sm text-accentRed mt-1">
            {error.name}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="priceInCents" className="block text-lg font-semibold text-textHeading">
          Price
        </Label>
        <div className="flex items-center gap-4">
          <Input
            id="priceInCents"
            name="priceInCents"
            type="number"
            min={0}
            required
            value={priceInCents}
            onChange={(e) => setPriceInCents(e.target.value)}
            aria-invalid={!!error.priceInCents}
            aria-describedby={error.priceInCents ? "price-error" : undefined}
            className={`transition border rounded-md focus:outline-none focus:ring-2 focus:ring-accentBlue ${
              error.priceInCents ? 'border-accentRed' : 'border-borderBg'
            }`}
          />
          <span className="text-textPrimary/70 select-none">
            {formatCurrency((Number(priceInCents) || 0) / 100)}
          </span>
        </div>
        {error.priceInCents && (
          <p id="price-error" className="text-sm text-accentRed mt-1">
            {error.priceInCents}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="block text-lg font-semibold text-textHeading">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ''}
          aria-invalid={!!error.description}
          aria-describedby={error.description ? "desc-error" : undefined}
          rows={4}
          className={`transition border rounded-md focus:outline-none focus:ring-2 focus:ring-accentBlue ${
            error.description ? 'border-accentRed' : 'border-borderBg'
          }`}
        />
        {error.description && (
          <p id="desc-error" className="text-sm text-accentRed mt-1">
            {error.description}
          </p>
        )}
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="file" className="block text-lg font-semibold text-textHeading">
          File
        </Label>
        <Input
          id="file"
          name="file"
          type="file"
          accept=".pdf,.doc,.docx"
          required={!product}
          onChange={handleFileChange}
          aria-invalid={!!(error.file || fileError)}
          aria-describedby={(error.file || fileError) ? "file-error" : undefined}
          className={`transition border rounded-md focus:outline-none focus:ring-2 focus:ring-accentBlue ${
            error.file || fileError ? 'border-accentRed' : 'border-borderBg'
          }`}
        />
        {(product && !fileError) && (
          <p className="text-textPrimary/70 text-sm">{product.filePath}</p>
        )}
        {(error.file || fileError) && (
          <p id="file-error" className="text-sm text-accentRed mt-1">
            {error.file || fileError}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image" className="block text-lg font-semibold text-textHeading">
          Image
        </Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required={!product}
          onChange={handleImageChange}
          aria-invalid={!!(error.image || imageError)}
          aria-describedby={(error.image || imageError) ? "image-error" : undefined}
          className={`transition border rounded-md focus:outline-none focus:ring-2 focus:ring-accentBlue ${
            error.image || imageError ? 'border-accentRed' : 'border-borderBg'
          }`}
        />
        {product && !imageError && (
          <Image
            src={product.imagePath}
            alt="Product"
            width={400}
            height={300}
            className="rounded-md border border-borderBg mt-2"
            loading="lazy"
          />
        )}
        {(error.image || imageError) && (
          <p id="image-error" className="text-sm text-accentRed mt-1">
            {error.image || imageError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="adminAction"
        disabled={pending || !!fileError || !!imageError}
        className="w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {pending ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
