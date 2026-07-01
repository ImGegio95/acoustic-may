import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footGrid}>
        <div className={styles.footCol}>
          <div className="logo" style={{ marginBottom: '14px' }}>
            <Image 
              src="/logo.webp" 
              alt="Acoustic May Logo" 
              width={140} 
              height={35} 
            />
          </div>
          <p style={{ color: 'var(--stone-d)', maxWidth: '230px' }}>
            Diffusori acustici artigianali, costruiti a mano in Puglia.
          </p>
          <p style={{ marginTop: '14px' }}>Via dei Muratori SN, 73018 Squinzano (LE)</p>
          <p>+39 351 576 4771 (Nicola)</p>
          <p>info@acousticmay.it</p>
        </div>
        <div className={styles.footCol}>
          <h5>Negozio</h5>
          <Link href="/catalogo?cat=studio-monitor">Studio Monitor</Link>
          <Link href="/catalogo?cat=garden-audio">Garden Audio</Link>
          <Link href="/catalogo?cat=home-hifi">Home Hi-Fi</Link>
          <Link href="/catalogo?cat=accessori">Accessori</Link>
        </div>
        <div className={styles.footCol}>
          <h5>Azienda</h5>
          <Link href="/chi-siamo">Chi siamo</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/lavora-con-noi">Lavora con noi</Link>
        </div>
        <div className={styles.footCol}>
          <h5>Assistenza</h5>
          <Link href="/assistenza">Domande frequenti</Link>
          <Link href="/assistenza">Assistenza tecnica</Link>
          <Link href="/contatti">Contatti</Link>
          <Link href="/assistenza">Manuali e download</Link>
        </div>
        <div className={`${styles.footCol} ${styles.newsletter}`}>
          <h5>Resta in ascolto</h5>
          <input placeholder="La tua email" />
          <button>Iscriviti</button>
        </div>
      </div>
      <div className={styles.footBottom}>
        <span>© 2026 Acoustic May — P.IVA 04748730753</span>
        <div className={styles.legal}>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/condizioni">Condizioni di vendita</Link>
        </div>
        <div className={styles.payments} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--stone-d)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Pagamenti Sicuri con Stripe</span>
        </div>
      </div>
    </footer>
  );
}
