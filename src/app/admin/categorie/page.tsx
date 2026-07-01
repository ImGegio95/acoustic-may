import { db } from "@/db";
import { categories } from "@/db/schema";
import Header from "@/components/Header";
import AdminNav from "@/components/AdminNav";
import styles from "../page.module.css";
import CategoryClientPage from "./CategoryClientPage";

export default async function CategoriePage() {
  const allCategories = await db.select().from(categories);

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          <header className={styles.header}>
            <div>
              <h1>Gestione Categorie</h1>
              <p>Crea, modifica e ottimizza le categorie per i motori di ricerca.</p>
            </div>
          </header>
          <AdminNav />
          <div className={styles.content}>
            <CategoryClientPage categories={allCategories} />
          </div>
        </div>
      </main>
    </>
  );
}
