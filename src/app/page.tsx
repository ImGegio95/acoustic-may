import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";
import Link from "next/link";
import { getLatestProducts } from "@/lib/db-actions";

import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const dbProducts = await getLatestProducts(100);
  
  const novitaSetting = await db.select().from(settings).where(eq(settings.key, "homepage_novita"));
  const bestsellerSetting = await db.select().from(settings).where(eq(settings.key, "homepage_bestseller"));
  const brandsSetting = await db.select().from(settings).where(eq(settings.key, "homepage_brands"));

  let novitaIds: number[] = [];
  let bestsellerIds: number[] = [];
  let brandsList: string[] = ["NEUTRIK", "CELESTION", "DAYTON AUDIO", "MUNDORF", "SCAN-SPEAK"];

  try {
    if (novitaSetting.length > 0 && novitaSetting[0].value) novitaIds = JSON.parse(novitaSetting[0].value);
    if (bestsellerSetting.length > 0 && bestsellerSetting[0].value) bestsellerIds = JSON.parse(bestsellerSetting[0].value);
    if (brandsSetting.length > 0 && brandsSetting[0].value) brandsList = JSON.parse(brandsSetting[0].value);
  } catch (e) {}

  // Format for the component
  const formattedProducts = dbProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name || "Uncategorized",
    description: p.description || "",
    price: `${p.price} €`,
    badge: p.badge
  }));

  const news = novitaIds.length > 0 
    ? novitaIds.map(id => formattedProducts.find(p => p.id === id)).filter(Boolean) as typeof formattedProducts
    : formattedProducts.filter(p => p.badge === 'Novità').slice(0, 4);

  const best = bestsellerIds.length > 0
    ? bestsellerIds.map(id => formattedProducts.find(p => p.id === id)).filter(Boolean) as typeof formattedProducts
    : formattedProducts.slice(0, 4);

  return (
    <>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroRing}></div>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>
              <svg className={styles.wave} viewBox="0 0 28 10">
                <path d="M0 5 Q3 0 6 5 T12 5 T18 5 T24 5 T28 5" stroke="#E8C9B0" strokeWidth="1.4" fill="none"/>
              </svg>
              Fatti a mano in Puglia
            </div>
            <h1>Il suono nasce<br/>dalle mani.</h1>
            <p>Diffusori acustici artigianali, costruiti uno a uno, legno dopo legno, per chi non si accontenta di ascoltare la musica — vuole sentirla.</p>
            <div className={styles.btnRow}>
              <Link href="/catalogo" className="btn btn-primary">Scopri la collezione →</Link>
              <Link href="/chi-siamo" className="btn btn-ghost">Guarda il processo</Link>
            </div>
          </div>
        </section>

        <div className={styles.waveDivider}>
          <svg width="200" height="20" viewBox="0 0 200 20">
            <path d="M0 10 Q12 2 24 10 T48 10 T72 10 T96 10 T120 10 T144 10 T168 10 T192 10" stroke="#BD5B2C" strokeWidth="1.3" fill="none"/>
          </svg>
        </div>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.values}>
              <div className={styles.value}>
                <div className={styles.n}>01 / artigianalità</div>
                <h3>Realizzati a mano</h3>
                <p>Ogni cabinet è progettato e assemblato internamente, con la cura di chi conosce ogni vite del proprio prodotto.</p>
              </div>
              <div className={styles.value}>
                <div className={styles.n}>02 / materiali</div>
                <h3>Legno e componenti premium</h3>
                <p>Multistrato di betulla e pioppo, altoparlanti selezionati: la qualità si sente prima ancora di accendere l'impianto.</p>
              </div>
              <div className={styles.value}>
                <div className={styles.n}>03 / competenza</div>
                <h3>Massima competenza tecnica</h3>
                <p>Anni di esperienza nell'acustica applicata, dallo studio di registrazione al giardino di casa.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div>
                <div className={styles.tag}>Esplora</div>
                <h2>Una linea per ogni ambiente</h2>
              </div>
              <Link href="/catalogo" className={styles.seeAll}>Vedi tutte le categorie →</Link>
            </div>
            <div className={styles.catGrid}>
              <Link href="/catalogo?cat=studio-monitor" className={`${styles.catCard} ${styles.tall}`}>
                <div className={styles.catLabel}><small>Per lo studio</small><h3>Studio Monitor</h3></div>
              </Link>
              <Link href="/catalogo?cat=garden-audio" className={styles.catCard}>
                <div className={styles.catLabel}><small>Per l'outdoor</small><h3>Garden Audio</h3></div>
              </Link>
              <Link href="/catalogo?cat=home-hifi" className={styles.catCard}>
                <div className={styles.catLabel}><small>Home Hi-Fi</small><h3>OUD & Radice</h3></div>
              </Link>
              <Link href="/catalogo?cat=accessori" className={styles.catCard}>
                <div className={styles.catLabel}><small>Cura il tuo impianto</small><h3>Accessori</h3></div>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ background: 'var(--paper2)' }}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div><div className={styles.tag}>In evidenza</div><h2>Novità in collezione</h2></div>
              <Link href="/catalogo" className={styles.seeAll}>Vedi tutto →</Link>
            </div>
            <div className={styles.prodGrid}>
              {news.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div><div className={styles.tag}>I più amati</div><h2>Best seller</h2></div>
              <Link href="/catalogo" className={styles.seeAll}>Vedi tutto →</Link>
            </div>
            <div className={styles.prodGrid}>
              {best.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.whySection}`}>
          <div className="container">
            <div className={styles.sectionHead}>
              <div>
                <div className={styles.tag}>Perché Acoustic May</div>
                <h2 style={{ color: 'var(--paper)' }}>Non un prodotto in serie. Il tuo.</h2>
                <div className={styles.desc}>Costruiamo su misura, ascoltando le esigenze di chi compra: forme, finiture, dimensioni.</div>
              </div>
            </div>
            <div className={styles.whyGrid}>
              <div className={styles.whyItem}><div className={styles.ico}>✓</div><h4>100% Made in Italy</h4><p>Produzione interna, dalla falegnameria al collaudo acustico finale.</p></div>
              <div className={styles.whyItem}><div className={styles.ico}>↻</div><h4>Su misura</h4><p>Personalizziamo forme e finiture in base alle richieste del cliente.</p></div>
              <div className={styles.whyItem}><div className={styles.ico}>⚙</div><h4>Collaudo reale</h4><p>Ogni diffusore viene testato individualmente prima della spedizione.</p></div>
              <div className={styles.whyItem}><div className={styles.ico}>☎</div><h4>Assistenza diretta</h4><p>Parli con chi costruisce, non con un call center.</p></div>
            </div>
          </div>
        </section>


        {brandsList.length > 0 && (
          <section className={styles.section} style={{ paddingTop: 0, paddingBottom: '80px' }}>
            <div className="container">
              <div className={styles.brandRow} style={{ borderTop: '1px solid var(--line)', padding: '30px 0', marginTop: '20px' }}>
                {brandsList.map((b, i) => <span key={i}>{b}</span>)}
              </div>
            </div>
          </section>
        )}

        <div className={styles.ctaFinal}>
          <h2>Ascolta la differenza fatta a mano.</h2>
          <p>Parla con noi per un progetto su misura, o scopri subito la collezione completa.</p>
          <div className={styles.btnRow} style={{ justifyContent: 'center' }}>
            <Link href="/catalogo" className="btn btn-primary">Scopri la collezione</Link>
            <Link href="/contatti" className="btn btn-ghost">Richiedi una consulenza</Link>
          </div>
        </div>
        <div style={{ height: '80px' }}></div>
      </main>
      <Footer />
    </>
  );
}
