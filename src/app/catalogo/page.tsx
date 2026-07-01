import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";
import Link from "next/link";
import { db } from "@/db";
import { categories as categoriesTable, products as productsTable } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { Search, ArrowUpDown } from "lucide-react";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const categories = await db.select().from(categoriesTable);
  
  const allProducts = await db.query.products.findMany({
    with: {
      category: true,
    },
  });

  let filteredProducts = [...allProducts];

  // Category Filter
  if (params.cat) {
    filteredProducts = filteredProducts.filter(p => p.category?.slug === params.cat);
  }

  // Search Filter
  if (params.q) {
    const query = params.q.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description?.toLowerCase().includes(query) ||
      p.category?.name.toLowerCase().includes(query)
    );
  }

  // Sorting
  if (params.sort) {
    if (params.sort === 'price-asc') {
      filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (params.sort === 'price-desc') {
      filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
    }
  }

  const formattedProducts = filteredProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name || "Uncategorized",
    description: p.description || "",
    price: `${p.price} €`,
    badge: p.badge,
    image: p.image
  }));

  const selectedCategory = params.cat ? categories.find(c => c.slug === params.cat) : null;
  const currentCat = selectedCategory ? {
    title: selectedCategory.name,
    subtitle: selectedCategory.slug === 'studio-monitor' ? 'Precisione sonora per il tuo studio' : 
              selectedCategory.slug === 'garden-audio' ? "L'armonia del suono nel tuo spazio verde" :
              selectedCategory.slug === 'home-hifi' ? "L'eccellenza artigianale nel cuore della tua casa" :
              "Accessori professionali",
    description: selectedCategory.description
  } : null;

  return (
    <>
      <Header />
      <main className="container">
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> / {params.cat ? categories.find(c => c.slug === params.cat)?.name : 'Catalogo'}
        </div>

        {currentCat ? (
          <div className={styles.catHero}>
            <div className={styles.heroContent}>
              <span className={styles.catBadge}>Linea {currentCat.title}</span>
              <h1>{currentCat.title}</h1>
              <h3>{currentCat.subtitle}</h3>
              <div className={styles.heroDesc}>
                {currentCat.description}
              </div>
            </div>
            <div className={styles.heroImagePlaceholder}>
              {/* Placeholder for category hero image */}
              <div className={styles.glassCard}>
                <span>Acoustic May Experience</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.catHeader}>
            <h1>{params.q ? `Ricerca: ${params.q}` : 'Catalogo'}</h1>
            <p>Esplora la nostra collezione di diffusori artigianali.</p>
          </div>
        )}
        
        <div className={styles.catLayout}>
          <aside className={styles.filters}>
            <div className={styles.filterGroup}>
              <h5>Categoria</h5>
              <Link 
                href="/catalogo"
                className={`${styles.fChip} ${!params.cat ? styles.checked : ''}`}
              >
                <span className={styles.box}></span> Tutte le categorie
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/catalogo?cat=${cat.slug}${params.q ? `&q=${params.q}` : ''}`}
                  className={`${styles.fChip} ${params.cat === cat.slug ? styles.checked : ''}`}
                >
                  <span className={styles.box}></span> {cat.name}
                </Link>
              ))}
            </div>
          </aside>

          <main className={styles.catMain}>
            <form action="/catalogo" method="GET" className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} strokeWidth={1.5} />
              <input 
                type="text" 
                name="q" 
                defaultValue={params.q} 
                placeholder="Cerca diffusori..." 
              />
              {params.cat && <input type="hidden" name="cat" value={params.cat} />}
            </form>
            
            <div className={styles.catToolbar}>
              <span className={styles.resultsCount}>{formattedProducts.length} prodotti trovati</span>
              <div className={styles.sortWrapper}>
                <label><ArrowUpDown size={14} strokeWidth={1.5} /> Ordina per</label>
                <div className={styles.sortOptions}>
                  <Link href={`/catalogo?sort=price-asc${params.cat ? `&cat=${params.cat}` : ''}${params.q ? `&q=${params.q}` : ''}`} className={params.sort === 'price-asc' ? styles.activeSort : ''}>Prezzo cresc.</Link>
                  <Link href={`/catalogo?sort=price-desc${params.cat ? `&cat=${params.cat}` : ''}${params.q ? `&q=${params.q}` : ''}`} className={params.sort === 'price-desc' ? styles.activeSort : ''}>Prezzo decresc.</Link>
                </div>
              </div>
            </div>

            {formattedProducts.length === 0 ? (
              <div className={styles.noResults}>
                <h3>Nessun prodotto trovato</h3>
                <p>Prova a cambiare i filtri o la ricerca.</p>
                <Link href="/catalogo" className="btn btn-outline">Resetta tutto</Link>
              </div>
            ) : (
              <div className={styles.prodGrid}>
                {formattedProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </main>
      <Footer />
    </>
  );
}
