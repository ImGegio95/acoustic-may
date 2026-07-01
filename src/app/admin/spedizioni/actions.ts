"use server";

import { db } from "@/db";
import { shippingOptions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addShippingOption(data: FormData) {
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  const price = data.get("price") as string;
  const minOrderValue = data.get("minOrderValue") as string;

  await db.insert(shippingOptions).values({
    name,
    description,
    price: price || "0",
    minOrderValue: minOrderValue || null,
  });

  revalidatePath("/admin/spedizioni");
  revalidatePath("/checkout");
}

export async function deleteShippingOption(id: number) {
  await db.delete(shippingOptions).where(eq(shippingOptions.id, id));
  revalidatePath("/admin/spedizioni");
  revalidatePath("/checkout");
}

export async function toggleShippingOption(id: number, currentStatus: boolean) {
  await db.update(shippingOptions).set({ isActive: !currentStatus }).where(eq(shippingOptions.id, id));
  revalidatePath("/admin/spedizioni");
  revalidatePath("/checkout");
}

export async function updateShippingOption(data: FormData) {
  const id = Number(data.get("id"));
  const name = data.get("name") as string;
  const description = data.get("description") as string;
  const price = data.get("price") as string;
  const minOrderValue = data.get("minOrderValue") as string;

  await db.update(shippingOptions).set({
    name,
    description,
    price: price || "0",
    minOrderValue: minOrderValue || null,
  }).where(eq(shippingOptions.id, id));

  revalidatePath("/admin/spedizioni");
  revalidatePath("/checkout");
}

export async function moveShippingOption(id: number, direction: 'up' | 'down') {
  const options = await db.select().from(shippingOptions).orderBy(asc(shippingOptions.sortOrder));
  
  // Normalizza gli indici se sono sballati (es. tutti a zero)
  for (let i = 0; i < options.length; i++) {
    if (options[i].sortOrder !== i) {
      await db.update(shippingOptions).set({ sortOrder: i }).where(eq(shippingOptions.id, options[i].id));
      options[i].sortOrder = i;
    }
  }

  const currentIndex = options.findIndex((o) => o.id === id);
  if (currentIndex === -1) return;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= options.length) return;

  const currentOpt = options[currentIndex];
  const targetOpt = options[targetIndex];

  // Scambia i posti
  await db.update(shippingOptions).set({ sortOrder: targetOpt.sortOrder }).where(eq(shippingOptions.id, currentOpt.id));
  await db.update(shippingOptions).set({ sortOrder: currentOpt.sortOrder }).where(eq(shippingOptions.id, targetOpt.id));

  revalidatePath("/admin/spedizioni");
  revalidatePath("/checkout");
}
