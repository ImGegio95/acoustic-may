import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";
import { db } from "@/db";
import { categories as categoriesTable, products as productsTable } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { Search, ArrowUpDown } from "lucide-react";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const params = await searchParams;
  const categories = await db.select().from(categoriesTable);
  
  const allProducts = await db.query.products.findMany({
    with: {
      category: true,
    },
  });

  let filteredProducts = allProducts;

  if (params.cat) {
    filteredProducts = allProducts.filter(p => p.category?.slug === params.cat);
  }

  const formattedProducts = filteredProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name || "Uncategorized",
    description: p.description || "",
    price: `${p.price} €`,
    badge: p.badge
  }));

  return (
    <>
      <Header />
      <main className="container">
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> / Catalogo
        </div>
        <div className={styles.catHeader}>
          <h1>Catalogo</h1>
          <p>Esplora la nostra collezione di diffusori artigianali.</p>
        </div>
        
        <div className={styles.catLayout}>
          <aside className={styles.filters}>
            <div className={styles.filterGroup}>
              <h5>Categoria</h5>
              {categories.map(cat => (
                <a 
                  key={cat.id} 
                  href={`/catalogo?cat=${cat.slug}`}
                  className={`${styles.fChip} ${params.cat === cat.slug ? styles.checked : ''}`}
                >
                  <span className={styles.box}></span> {cat.name}
                </a>
              ))}
              {params.cat && (
                <a href="/catalogo" className={styles.clearFilters}>Rimuovi filtri ×</a>
              )}
            </div>
          </aside>

          <main className={styles.catMain}>
            <div className={styles.searchBar}>
              <Search size={18} className={styles.searchIcon} strokeWidth={1.5} />
              <input type="text" placeholder="Cerca diffusori..." />
            </div>
            <div className={styles.catToolbar}>
              <span className={styles.resultsCount}>{formattedProducts.length} prodotti trovati</span>
              <div className={styles.sortWrapper}>
                <label htmlFor="sort-select"><ArrowUpDown size={14} strokeWidth={1.5} /> Ordina per</label>
                <select id="sort-select" className={styles.sortSelect}>
                  <option>In rilievo</option>
                  <option>Prezzo: crescente</option>
                  <option>Prezzo: decrescente</option>
                </select>
              </div>
            </div>
            <div className={styles.prodGrid}>
              {formattedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </main>
        </div>
      </main>
      <Footer />
    </>
  );
}
