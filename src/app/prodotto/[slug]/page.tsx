import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { getProductBySlug } from "@/lib/db-actions";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import { Metadata } from "next";
import Link from "next/link";
import PDPActions from "@/components/PDPActions";
import ProductTabs from "@/components/ProductTabs";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description,
    openGraph: {
      title: `${product.seoTitle || product.name} | Acoustic May`,
      description: product.seoDescription || product.description || "",
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
            <div className={styles.pdpPriceRow}>
              <span className={styles.pdpPrice}>{product.price} €</span>
            </div>
            <div className={styles.stock}>
              <span className={styles.dot}></span> 
              Prodotto artigianale — Realizzato su ordinazione
            </div>

            <PDPActions 
              product={product as any} 
              variants={(product as any).variants || []}
            />
            
            <Link 
              href={`/contatti?product=${product.slug}`}
              className="btn btn-outline" 
              style={{ width: '100%', justifyContent: 'center', borderRadius: '100px', marginBottom: '32px' }}
            >
              Richiedi informazioni
            </Link>

            <ProductTabs 
              description={product.description} 
              specs={product.technicalSpecs} 
              sheetUrl={product.technicalSheetUrl} 
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
