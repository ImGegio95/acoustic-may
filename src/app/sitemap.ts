import { MetadataRoute } from 'next';
import { db } from '@/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.acousticmay.it';

  // Fetch all products for dynamic routes
  const products = await db.query.products.findMany();
  const productEntries = products.map((p) => ({
    url: `${baseUrl}/prodotto/${p.slug}`,
    lastModified: p.createdAt || new Date(),
  }));

  // Static routes
  const staticRoutes = [
    '',
    '/catalogo',
    '/chi-siamo',
    '/contatti',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productEntries];
}
