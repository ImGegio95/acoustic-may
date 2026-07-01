import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts, getCategories, getSetting, getAttributes } from "@/lib/db-actions";
import styles from "./page.module.css";
import { Package, Tag, BarChart3 } from "lucide-react";
import AdminProductTable from "@/components/AdminProductTable";
import AdminHeader from "@/components/AdminHeader";
import AdminSettings from "@/components/AdminSettings";
import AdminAttributes from "@/components/AdminAttributes";

export default async function AdminDashboard() {
  const products = await getProducts();
  const categories = await getCategories();
  const attributes = await getAttributes();
  
  const maintenanceMode = await getSetting("maintenance_mode") === "true";

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          <AdminHeader categories={categories} />

          {/* ... stats ... */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Package size={20} /></div>
              <div>
                <span className={styles.statLabel}>Prodotti</span>
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
                <span className={styles.statLabel}>Visite (30d)</span>
                <span className={styles.statValue}>1,240</span>
              </div>
            </div>
          </div>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Gestione Catalogo</h2>
              <div className={styles.tableSearch}>
                <input type="text" placeholder="Cerca prodotto..." />
              </div>
            </div>

            <AdminProductTable products={products} categories={categories} />
          </section>

          <AdminAttributes attributes={attributes} />

          <AdminSettings initialMode={maintenanceMode} />
        </div>
      </main>
      <Footer />
    </>
  );
}
