import { db } from "@/db";
import { products, settings } from "@/db/schema";
import Header from "@/components/Header";
import AdminNav from "@/components/AdminNav";
import styles from "../page.module.css";
import HomepageClient from "./HomepageClient";
import { eq } from "drizzle-orm";

export default async function HomepageAdmin() {
  const allProducts = await db.select().from(products);
  
  const novitaSetting = await db.select().from(settings).where(eq(settings.key, "homepage_novita"));
  const bestsellerSetting = await db.select().from(settings).where(eq(settings.key, "homepage_bestseller"));
  const brandsSetting = await db.select().from(settings).where(eq(settings.key, "homepage_brands"));

  let initialNovita: number[] = [];
  let initialBestseller: number[] = [];
  let initialBrands: string[] = ["NEUTRIK", "CELESTION", "DAYTON AUDIO", "MUNDORF", "SCAN-SPEAK"];

  try {
    if (novitaSetting.length > 0 && novitaSetting[0].value) initialNovita = JSON.parse(novitaSetting[0].value);
    if (bestsellerSetting.length > 0 && bestsellerSetting[0].value) initialBestseller = JSON.parse(bestsellerSetting[0].value);
    if (brandsSetting.length > 0 && brandsSetting[0].value) initialBrands = JSON.parse(brandsSetting[0].value);
  } catch (e) {}

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          <header className={styles.header}>
            <div>
              <h1>Gestione Home Page</h1>
              <p>Scegli manualmente i prodotti e i marchi da esporre sulla vetrina principale.</p>
            </div>
          </header>
          <AdminNav />
          <div className={styles.content}>
            <HomepageClient 
              products={allProducts} 
              initialNovita={initialNovita} 
              initialBestseller={initialBestseller}
              initialBrands={initialBrands}
            />
          </div>
        </div>
      </main>
    </>
  );
}
