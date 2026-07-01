"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import styles from "../page.module.css";
import Image from "next/image";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Svuotiamo il carrello non appena atterra qui
    clearCart();
    setMounted(true);
  }, [clearCart]);

  if (!mounted) return null;

  return (
    <div className={styles.checkoutWrapper}>
      <header className={styles.checkoutHeader}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.webp" alt="Acoustic May Logo" width={140} height={35} />
        </Link>
      </header>
      
      <main className={styles.main} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', background: 'var(--paper2)', padding: '48px', borderRadius: '16px', maxWidth: '500px' }}>
          <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: '24px' }} />
          <h1 style={{ marginBottom: '16px', fontSize: '28px' }}>Ordine Confermato!</h1>
          <p style={{ color: 'var(--stone-d)', lineHeight: '1.6', marginBottom: '32px' }}>
            Grazie per il tuo acquisto su Acoustic May. Abbiamo ricevuto il pagamento e stiamo già preparando il tuo ordine.
            Riceverai a breve un'email di riepilogo.
          </p>
          <Link href="/catalogo" className="btn btn-dark" style={{ width: '100%' }}>
            Torna allo shopping
          </Link>
        </div>
      </main>
    </div>
  );
}
