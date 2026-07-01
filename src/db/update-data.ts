import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const connection = await mysql.createConnection(url);
  const db = drizzle(connection, { schema, mode: "default" });

  console.log("Updating product data...");

  // 1. Update Bontone 6C
  await db.update(schema.products).set({
    description: "Le Bontone attive sono progettate per essere dei monitor Mono Via (Full-range) di riferimento. Dotate di amplificatore in classe D da 70W RMS con DSP interno per un'immagine sonora definita e focalizzata.",
    technicalSpecs: JSON.stringify({
      "Tipologia": "Monitor Full-Range 6\" con bass reflex",
      "Risposta in frequenza": "56 – 19000 Hz",
      "Impedenza": "4 ohm",
      "Amplificatore": "Classe D",
      "Potenza": "70Watt RMS",
      "Ingressi": "XLR & TRS (combo jack)",
      "Peso": "2,8 Kg",
      "Dimensioni": "180mm x 180mm x 180mm"
    }),
    image: "/products/bontone-black.webp",
  }).where(eq(schema.products.slug, "bontone-6c"));
  const categoriesList = [
    { name: 'Studio Monitor', slug: 'studio-monitor' },
    { name: 'Garden Audio', slug: 'garden-audio' },
    { name: 'Home Hi-Fi', slug: 'home-hifi' },
    { name: 'Accessori', slug: 'accessori' },
  ];

  for (const cat of categoriesList) {
    await db.insert(schema.categories).ignore().values({
      name: cat.name,
      slug: cat.slug,
    });
  }

  const productsData = [
    {
      name: 'Bontone 6c',
      slug: 'bontone-6c',
      description: 'Studio monitor attivo a 2 vie, progettato per offrire una risposta in frequenza lineare e una riproduzione sonora fedele. Ideale per studi di registrazione professionali e project studio.',
      price: '450.00',
      category: 'Studio Monitor',
      image: '/products/bontone-black.webp',
      specs: JSON.stringify({
        'Risposta in frequenza': '56 - 19.000 Hz',
        'Potenza': '70W RMS',
        'Woofer': '6.5" in fibra di vetro',
        'Tweeter': '1" cupola in seta',
        'Ingressi': 'Combo XLR/TRS',
      }),
    },
    {
      name: 'GARDEN',
      slug: 'garden',
      description: 'La linea Garden nasce per soddisfare i nostri clienti più esigenti, garantendo prestazioni d’ascolto coinvolgenti ed elevate anche nel proprio giardino. Dotate di illuminazione Led.',
      price: '320.00',
      category: 'Garden Audio',
      image: '/products/garden-1.webp',
      specs: JSON.stringify({
        'Caratteristica': 'Illuminazione LED integrata',
        'Uso': 'Esterno / Giardino',
        'Materiale': 'Resistente agli agenti atmosferici',
      }),
    },
    {
      name: 'OUD',
      slug: 'oud',
      description: 'Diffusore artigianale in legno d\'ulivo salentino. Un capolavoro di design e acustica che porta l\'essenza del territorio nel tuo ambiente d\'ascolto Hi-Fi.',
      price: '580.00',
      category: 'Home Hi-Fi',
      image: '/products/oud-1.webp',
      specs: JSON.stringify({
        'Materiale': 'Legno di Ulivo secolare',
        'Tecnologia': 'Point-source',
        'Produzione': '100% Artigianale',
      }),
    },
    {
      name: 'Radice',
      slug: 'radice',
      description: 'Diffusore 2 vie con radiatore passivo. Nato dal recupero delle radici di ulivi colpiti da Xylella, trasforma un problema ambientale in un oggetto sonoro di pregio.',
      price: '640.00',
      category: 'Home Hi-Fi',
      image: '/products/radice-1.webp',
      specs: JSON.stringify({
        'Sistema': '2 via con radiatore passivo',
        'Tweeter': 'Cupola in seta 1"',
        'Storia': 'Legno di recupero certificato',
      }),
    },
    {
      name: 'Flight Case Bontone',
      slug: 'flight-case-bontone',
      description: 'Protezione professionale per i tuoi monitor Bontone. Costruzione robusta in legno e alluminio con interno sagomato in schiuma ad alta densità.',
      price: '140.00',
      category: 'Accessori',
      image: '/products/flight-case-1.webp',
      specs: JSON.stringify({
        'Compatibilità': 'Bontone 6c',
        'Materiale': 'Legno multistrato + Alluminio',
        'Peso': '4.5 kg',
      }),
    },
  ];

  for (const prod of productsData) {
    const cat = await db.query.categories.findFirst({
      where: eq(schema.categories.name, prod.category),
    });

    if (cat) {
      await db.insert(schema.products).values({
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        categoryId: cat.id,
        image: prod.image,
        technicalSpecs: prod.specs,
      }).onDuplicateKeyUpdate({
        set: {
          description: prod.description,
          price: prod.price,
          image: prod.image,
          technicalSpecs: prod.specs,
          categoryId: cat.id,
        }
      });
    }
  }

  console.log("Update completed!");
  await connection.end();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
