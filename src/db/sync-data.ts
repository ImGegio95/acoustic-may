import "dotenv/config";
import { db } from "./index";
import { categories, products } from "./schema";
import { eq } from "drizzle-orm";

async function sync() {
  console.log("Syncing database...");

  // 1. Ensure Categories exist with correct slugs
  const categoryData = [
    { name: "Studio Monitor", slug: "studio-monitor", description: "Monitor di riferimento per professionisti e studi di registrazione." },
    { name: "Garden Audio", slug: "garden-audio", description: "Sistemi audio progettati per l'outdoor, resistenti e dal suono naturale." },
    { name: "Home Hi-Fi", slug: "home-hifi", description: "Diffusori acustici d'eccellenza per l'ascolto domestico." },
    { name: "Accessori", slug: "accessori", description: "Cavi, supporti e flight case per la cura dei tuoi diffusori." },
  ];

  for (const cat of categoryData) {
    const existing = await db.query.categories.findFirst({
      where: eq(categories.slug, cat.slug),
    });

    if (!existing) {
      await db.insert(categories).values(cat);
      console.log(`Created category: ${cat.name}`);
    } else {
      await db.update(categories).set(cat).where(eq(categories.id, existing.id));
      console.log(`Updated category: ${cat.name}`);
    }
  }

  // Get refreshed category IDs
  const allCats = await db.query.categories.findMany();
  const catMap = Object.fromEntries(allCats.map(c => [c.slug, c.id]));

  // 2. Ensure Products exist and are linked correctly
  const productData = [
    {
      name: "Bontone 6C",
      slug: "bontone-6c",
      description: "Monitor attivo a 2 vie, progettato per offrire una risposta in frequenza lineare e una riproduzione sonora fedele. Ideale per studi di registrazione professionali e project studio.",
      price: "450.00",
      categoryId: catMap["studio-monitor"],
      badge: "Novità",
      image: "/products/bontone-black-2021.webp"
    },
    {
      name: "Radice Outdoor 5",
      slug: "radice-outdoor-5",
      description: "Diffusore da esterno IP65 costruito in legno trattato. Suono naturale che si integra perfettamente nell'ambiente del giardino.",
      price: "310.00",
      categoryId: catMap["garden-audio"],
      badge: "In arrivo",
      image: "/products/garden-1.webp"
    },
    {
      name: "GARDEN",
      slug: "garden",
      description: "Sistema audio outdoor ad alta fedeltà. Resistenza agli agenti atmosferici senza compromessi sulla qualità sonora.",
      price: "420.00",
      categoryId: catMap["garden-audio"],
      image: "/products/garden-2.webp"
    },
    {
      name: "OUD 8 Floorstanding",
      slug: "oud-8",
      description: "Diffusore da pavimento a 3 vie con cabinet in multistrato di betulla. Design iconico e suono avvolgente.",
      price: "489.00",
      categoryId: catMap["home-hifi"],
      badge: "Best Seller",
      image: "/products/oud-1.webp"
    },
    {
      name: "Flight Case Bontone",
      slug: "flight-case-bontone",
      description: "Protezione professionale per i tuoi monitor Bontone durante il trasporto. Multistrato di betulla e HPL.",
      price: "140.00",
      categoryId: catMap["accessori"],
      image: "/products/flight-case-bontone-1.webp"
    }
  ];

  for (const prod of productData) {
    const existing = await db.query.products.findFirst({
      where: eq(products.slug, prod.slug),
    });

    if (!existing) {
      await db.insert(products).values(prod);
      console.log(`Created product: ${prod.name}`);
    } else {
      await db.update(products).set(prod).where(eq(products.id, existing.id));
      console.log(`Updated product: ${prod.name}`);
    }
  }

  console.log("Sync complete!");
  process.exit(0);
}

sync().catch(err => {
  console.error("Sync failed:", err);
  process.exit(1);
});
