// app/actions/products.ts
"use server"

import { z } from 'zod';
import { redirect, notFound } from 'next/navigation';
import db from '@/lib/db';
import fs from 'fs/promises';

// On the server, file inputs arrive as Blobs, not DOM Files
const blobSchema = z.instanceof(Blob, { message: 'Required' });
const imageSchema = blobSchema.refine(
  b => b.size === 0 || b.type.startsWith('image/'),
  { message: 'Must be an image file' }
);

const addSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  priceInCents: z.coerce.number().int().min(1, 'Price must be at least 1'),
  file: blobSchema.refine(b => b.size > 0, { message: 'File is required' }),
  image: imageSchema.refine(b => b.size > 0, { message: 'Image is required' }),
});

// CREATE
export async function addProduct(
  _prev: unknown,
  formData: FormData
) {
  const parsed = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return parsed.error.formErrors.fieldErrors;
  }
  const { name, description, priceInCents, file, image } = parsed.data;

  // Write the raw file
  await fs.mkdir('products', { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${file instanceof File ? file.name : 'upload'}`;
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  // Write the image under public/
  await fs.mkdir('public/products', { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${image instanceof File ? image.name : 'image'}`;
  await fs.writeFile(`public${imagePath}`, Buffer.from(await image.arrayBuffer()));

  // Persist
  await db.product.create({
    data: {
      isAvailable: false,
      name,
      description,
      priceInCents,
      filePath,
      imagePath,
    },
  });

  redirect('/admin/products');
}

// UPDATE
const editSchema = addSchema.extend({
  file: blobSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  _prev: unknown,
  formData: FormData
) {
  const parsed = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return parsed.error.formErrors.fieldErrors;
  }
  const { name, description, priceInCents, file, image } = parsed.data;

  const existing = await db.product.findUnique({ where: { id } });
  if (!existing) return notFound();

  // Replace file if present
  let filePath = existing.filePath;
  if (file && file.size > 0) {
    await fs.unlink(existing.filePath);
    filePath = `products/${crypto.randomUUID()}-${file instanceof File ? file.name : 'upload'}`;
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  }

  // Replace image if present
  let imagePath = existing.imagePath;
  if (image && image.size > 0) {
    await fs.unlink(`public${existing.imagePath}`);
    imagePath = `/products/${crypto.randomUUID()}-${image instanceof File ? image.name : 'image'}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await image.arrayBuffer()));
  }

  // Persist update
  await db.product.update({
    where: { id },
    data: {
      isAvailable: false,
      name,
      description,
      priceInCents,
      filePath,
      imagePath,
    },
  });

  redirect('/admin/products');
}

// DELETE
export async function deleteProduct(id: string) {
  const prod = await db.product.delete({ where: { id } });
  if (!prod) return notFound();
  await fs.unlink(prod.filePath);
  await fs.unlink(`public${prod.imagePath}`);
}

// TOGGLE
export async function toggleProductAvailability(
  id: string,
  isAvailable: boolean
) {
  await db.product.update({
    where: { id },
    data: { isAvailable },
  });
}
