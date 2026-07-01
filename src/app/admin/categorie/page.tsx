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
      <main className={styles.main}>
        <div className={styles.container}>
          <AdminNav />
          <div className={styles.content}>
            <CategoryClientPage categories={allCategories} />
          </div>
        </div>
      </main>
    </>
  );
}
