"use server";

import { db } from "@/db";
import { products, categories, settings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return await db.query.products.findMany({
    with: {
      category: true,
    },
    orderBy: [desc(products.createdAt)],
  });
}

export async function getCategories() {
  return await db.query.categories.findMany({
    orderBy: [desc(categories.name)],
  });
}

export async function getLatestProducts(limit = 4) {
  return await db.query.products.findMany({
    with: {
      category: true,
    },
    limit,
    orderBy: [desc(products.createdAt)],
  });
}

export async function getProductsByCategory(categorySlug: string) {
  const cat = await db.query.categories.findFirst({
    where: eq(categories.slug, categorySlug),
  });

  if (!cat) return [];

  return await db.query.products.findMany({
    where: eq(products.categoryId, cat.id),
    with: {
      category: true,
    },
  });
}

export async function getProductBySlug(slug: string) {
  return await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      category: true,
    },
  });
}

// ADMIN ACTIONS
export async function createProduct(data: any) {
  const res = await db.insert(products).values(data);
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  return res;
}

export async function updateProduct(id: number, data: any) {
  const res = await db.update(products).set(data).where(eq(products.id, id));
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  return res;
}

export async function deleteProduct(id: number) {
  const res = await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  return res;
}

export async function createCategory(data: any) {
  const res = await db.insert(categories).values(data);
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  return res;
}

export async function updateCategory(id: number, data: any) {
  const res = await db.update(categories).set(data).where(eq(categories.id, id));
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  return res;
}

export async function deleteCategory(id: number) {
  const res = await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  return res;
}

// SETTINGS ACTIONS
export async function getSetting(key: string) {
  const res = await db.query.settings.findFirst({
    where: eq(settings.key, key),
  });
  return res?.value;
}

export async function updateSetting(key: string, value: string) {
  const existing = await db.query.settings.findFirst({
    where: eq(settings.key, key),
  });

  if (existing) {
    await db.update(settings).set({ value }).where(eq(settings.key, key));
  } else {
    await db.insert(settings).values({ key, value });
  }
  revalidatePath("/admin");
  revalidatePath("/", "layout"); // Revalidate everything for maintenance mode
}

export async function getMaintenanceSettings() {
  const mode = await getSetting("maintenance_mode");
  const ips = await getSetting("allowed_ips");
  return {
    enabled: mode === "true",
    allowedIps: ips ? ips.split(",").map(ip => ip.trim()) : [],
  };
}
