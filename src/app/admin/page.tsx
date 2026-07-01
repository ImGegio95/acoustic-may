import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts, getCategories } from "@/lib/db-actions";
import styles from "./page.module.css";
import Link from "next/link";
import { Plus, Edit3, Trash2, Package, Tag, BarChart3 } from "lucide-react";

export default async function AdminDashboard() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          <header className={styles.header}>
            <div>
              <div className={styles.tag}>Gestione Store</div>
              <h1>Dashboard Amministratore</h1>
            </div>
            <button className="btn btn-primary">
              <Plus size={18} /> Nuovo Prodotto
            </button>
          </header>

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

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Immagine</th>
                    <th>Nome Prodotto</th>
                    <th>Categoria</th>
                    <th>Prezzo</th>
                    <th>Stato</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.prodThumb}>
                          {p.name.charAt(0)}
                        </div>
                      </td>
                      <td className={styles.prodName}>
                        <strong>{p.name}</strong>
                        <span>/{p.slug}</span>
                      </td>
                      <td>{p.category?.name}</td>
                      <td>{p.price} €</td>
                      <td>
                        <span className={`${styles.status} ${styles.active}`}>Attivo</span>
                      </td>
                      <td className={styles.actions}>
                        <button className={styles.actionBtn} title="Modifica"><Edit3 size={16} /></button>
                        <button className={styles.actionBtn} title="Elimina"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
