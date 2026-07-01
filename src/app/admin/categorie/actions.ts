"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addCategory(data: FormData) {
  const name = data.get("name") as string;
  const slug = data.get("slug") as string;
  const description = data.get("description") as string;
  const image = data.get("image") as string;
  const seoTitle = data.get("seoTitle") as string;
  const seoDescription = data.get("seoDescription") as string;

  await db.insert(categories).values({
    name,
    slug,
    description: description || null,
    image: image || null,
    seoTitle: seoTitle || null,
    seoDescription: seoDescription || null,
  });

  revalidatePath("/admin/categorie");
  revalidatePath("/catalogo");
}

export async function updateCategory(data: FormData) {
  const id = Number(data.get("id"));
  const name = data.get("name") as string;
  const slug = data.get("slug") as string;
  const description = data.get("description") as string;
  const image = data.get("image") as string;
  const seoTitle = data.get("seoTitle") as string;
  const seoDescription = data.get("seoDescription") as string;

  await db.update(categories).set({
    name,
    slug,
    description: description || null,
    image: image || null,
    seoTitle: seoTitle || null,
    seoDescription: seoDescription || null,
  }).where(eq(categories.id, id));

  revalidatePath("/admin/categorie");
  revalidatePath("/catalogo");
}

export async function deleteCategory(id: number) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categorie");
  revalidatePath("/catalogo");
}
