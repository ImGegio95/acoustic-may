"use server";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveHomepageSettings(novitaIds: number[], bestsellerIds: number[], brands: string[]) {
  // Save novita
  const existingNovita = await db.select().from(settings).where(eq(settings.key, "homepage_novita"));
  if (existingNovita.length > 0) {
    await db.update(settings).set({ value: JSON.stringify(novitaIds) }).where(eq(settings.key, "homepage_novita"));
  } else {
    await db.insert(settings).values({ key: "homepage_novita", value: JSON.stringify(novitaIds) });
  }

  // Save best sellers
  const existingBest = await db.select().from(settings).where(eq(settings.key, "homepage_bestseller"));
  if (existingBest.length > 0) {
    await db.update(settings).set({ value: JSON.stringify(bestsellerIds) }).where(eq(settings.key, "homepage_bestseller"));
  } else {
    await db.insert(settings).values({ key: "homepage_bestseller", value: JSON.stringify(bestsellerIds) });
  }

  // Save brands
  const existingBrands = await db.select().from(settings).where(eq(settings.key, "homepage_brands"));
  if (existingBrands.length > 0) {
    await db.update(settings).set({ value: JSON.stringify(brands) }).where(eq(settings.key, "homepage_brands"));
  } else {
    await db.insert(settings).values({ key: "homepage_brands", value: JSON.stringify(brands) });
  }

  revalidatePath("/");
  revalidatePath("/admin/homepage");
}
