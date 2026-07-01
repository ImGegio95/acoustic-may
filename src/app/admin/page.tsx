import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts, getCategories } from "@/lib/db-actions";
import styles from "./page.module.css";
import { Package, Tag, BarChart3 } from "lucide-react";
import AdminProductTable from "@/components/AdminProductTable";
import AdminHeader from "@/components/AdminHeader";

export default async function AdminDashboard() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          <AdminHeader categories={categories} />

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Package size={20} /></div>
              <div>
                <span className={styles.statLabel}>Prodotti Totali</span>
                <span className={styles.statValue}>{products.length}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Tag size={20} /></div>
              <div>
                <span className={styles.statLabel}>Categorie</span>
                <span className={styles.statValue}>{categories.length}</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><BarChart3 size={20} /></div>
              <div>
                <span className={styles.statLabel}>Ordini Recenti</span>
                <span className={styles.statValue}>0</span>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Prodotti in Catalogo</h2>
              <div className={styles.tableSearch}>
                <input type="text" placeholder="Cerca prodotto..." />
              </div>
            </div>

            <AdminProductTable products={products} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
