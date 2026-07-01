"use server";

import { db } from "@/db";
import { shippingOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
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
