import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const connection = mysql.createPool(process.env.DATABASE_URL!);
const db = drizzle(connection, { schema, mode: "default" });

async function main() {
  console.log("Seeding database...");

  // 1. Create Categories
  const catStudio = await db.insert(schema.categories).ignore().values({
    name: "Studio Monitor",
    slug: "studio",
    description: "Diffusori da studio professionali.",
  });
  const catGarden = await db.insert(schema.categories).ignore().values({
    name: "Garden Audio",
    slug: "garden",
    description: "Audio per esterni di alta qualità.",
  });
  const catHifi = await db.insert(schema.categories).ignore().values({
    name: "Home Hi-Fi",
    slug: "hifi",
    description: "Sistemi audio domestici d'eccellenza.",
  });
  const catAcc = await db.insert(schema.categories).ignore().values({
    name: "Accessori",
    slug: "accessori",
    description: "Cavi, stand e protezioni.",
  });

  // Get category IDs (simplified for seed)
  // In a real scenario we'd query them back, but here we can just use the indices if we're sure
  // Let's query them to be safe
  const allCats = await db.select().from(schema.categories);
  const findCat = (slug: string) => allCats.find(c => c.slug === slug)?.id;

  // 2. Create Products
  const products = [
    { 
      name: "Bontone 6C", 
      slug: "bontone-6c", 
      categoryId: findCat("studio"), 
      description: "Monitor attivo 2 vie 6.5\"", 
      price: "259.00", 
      badge: "Novità",
      technicalSpecs: JSON.stringify({
        Tipologia: "2 vie, attivo",
        Woofer: "6.5\" carta trattata",
        Tweeter: "1\" cupola in seta",
        Risposta: "48 Hz – 22 kHz",
        Materiale: "Multistrato di betulla 18mm",
        Dimensioni: "200 × 330 × 250 mm"
      })
    },
    { 
      name: "Radice Outdoor 5", 
      slug: "radice-outdoor-5", 
      categoryId: findCat("garden"), 
      description: "Diffusore da esterno IP65", 
      price: "310.00", 
      badge: "Novità" 
    },
    { 
      name: "OUD 8 Floorstanding", 
      slug: "oud-8-floorstanding", 
      categoryId: findCat("hifi"), 
      description: "Diffusore da pavimento a 3 vie", 
      price: "489.00" 
    },
    { 
      name: "OUD 5 Bookshelf", 
      slug: "oud-5-bookshelf", 
      categoryId: findCat("hifi"), 
      description: "Diffusore da scaffale 2 vie", 
      price: "229.00", 
      badge: "Novità" 
    },
    { 
      name: "Bontone 8C", 
      slug: "bontone-8c", 
      categoryId: findCat("studio"), 
      description: "Monitor attivo 2 vie 8\"", 
      price: "339.00", 
      badge: "-10%" 
    },
    { 
      name: "Stand regolabile", 
      slug: "stand-regolabile", 
      categoryId: findCat("accessori"), 
      description: "Coppia stand da pavimento", 
      price: "98.00" 
    }
  ];

  for (const p of products) {
    await db.insert(schema.products).ignore().values(p as any);
  }

  console.log("Seeding completed!");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
