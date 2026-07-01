import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getProductBySlug } from "@/lib/db-actions";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { Metadata } from "next";
import PDPActions from "@/components/PDPActions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Acoustic May`,
      description: product.description || "",
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const specs = product.technicalSpecs ? JSON.parse(product.technicalSpecs) : null;
  const galleryImages = product.images ? JSON.parse(product.images) : (product.image ? [product.image] : []);

  return (
    <>
      <Header />
      <main className="container">
        <div className={styles.breadcrumb}>
          <a href="/">Home</a> / <a href="/catalogo">Catalogo</a> / {product.category?.name}
        </div>
        
        <div className={styles.pdp}>
          <ProductGallery images={galleryImages} productName={product.name} />

          <div className={styles.pdpInfo}>
            <div className={styles.pCat}>{product.category?.name}</div>
            <h1>{product.name}</h1>
            <div className={styles.pdpStars}>
              <span className={styles.stars}>★★★★★</span> 
              <span>4.9 — 26 recensioni</span>
            </div>
            <div className={styles.pdpPriceRow}>
              <span className={styles.pdpPrice}>{product.price} €</span>
            </div>
            <div className={styles.stock}>
              <span className={styles.dot}></span> 
              Disponibile — spedizione in 3-5 giorni lavorativi
            </div>
            <p className={styles.pdpDesc}>{product.description}</p>

            <div className={styles.optGroup}>
              <h5>Finitura</h5>
              <div className={styles.swatches}>
                <div className={`${styles.swatch} ${styles.active}`} style={{ background: '#1c1a16' }}></div>
                <div className={styles.swatch} style={{ background: '#8a6a47' }}></div>
                <div className={styles.swatch} style={{ background: '#caa873' }}></div>
              </div>
            </div>

            <PDPActions product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              category: product.category?.name || "Uncategorized",
              image: product.image
            }} />
            
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', borderRadius: '100px' }}>
              Richiedi informazioni
            </button>

            {specs && (
              <div className={styles.infoLinkRow}>
                <div className={`${styles.accordionItem} ${styles.open}`}>
                  <div className={styles.accordionHead}>Caratteristiche tecniche <span>−</span></div>
                  <div className={styles.accordionBody}>
                    <table className={styles.specTable}>
                      <tbody>
                        {Object.entries(specs).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value as string}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
