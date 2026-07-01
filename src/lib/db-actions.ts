import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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
