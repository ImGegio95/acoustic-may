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
          <Link href="/catalogo?cat=studio">Studio Monitor</Link>
          <Link href="/catalogo?cat=garden">Garden Audio</Link>
          <Link href="/catalogo?cat=hifi">Home Hi-Fi</Link>
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
          <Link href="/faq">Domande frequenti</Link>
          <Link href="/assistenza">Assistenza tecnica</Link>
          <Link href="/contatti">Contatti</Link>
          <Link href="/manuali">Manuali e download</Link>
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
        <div className={styles.payments}>
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
    </footer>
  );
}
