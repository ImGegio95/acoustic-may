import Link from "next/link";
import { XCircle } from "lucide-react";
import styles from "../page.module.css";
import Image from "next/image";

export default function CheckoutCancelPage() {
  return (
    <div className={styles.checkoutWrapper}>
      <header className={styles.checkoutHeader}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.webp" alt="Acoustic May Logo" width={140} height={35} />
        </Link>
      </header>
      
      <main className={styles.main} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', background: 'var(--paper2)', padding: '48px', borderRadius: '16px', maxWidth: '500px' }}>
          <XCircle size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
          <h1 style={{ marginBottom: '16px', fontSize: '28px' }}>Pagamento Annullato</h1>
          <p style={{ color: 'var(--stone-d)', lineHeight: '1.6', marginBottom: '32px' }}>
            Non ti è stato addebitato alcun importo. Il tuo carrello è rimasto intatto e puoi riprovare ad effettuare l'acquisto quando lo desideri.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="/checkout" className="btn btn-dark" style={{ flex: 1 }}>
              Riprova
            </Link>
            <Link href="/catalogo" className="btn btn-outline" style={{ flex: 1 }}>
              Catalogo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
