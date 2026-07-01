"use client";

import { useCartStore } from "@/lib/store";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <h2>Il tuo carrello è vuoto</h2>
        <p>Aggiungi qualcosa prima di procedere al pagamento.</p>
        <Link href="/catalogo" className="btn btn-dark">Torna al catalogo</Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutWrapper}>
      <header className={styles.checkoutHeader}>
        <Link href="/" className={styles.logo}>
          <Image 
            src="/logo.webp" 
            alt="Acoustic May Logo" 
            width={140} 
            height={35} 
          />
        </Link>
        <div className={styles.steps}>
          <span className={styles.active}>Pagamento sicuro</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formSection}>
          <section className={styles.block}>
            <h3>1. Spedizione</h3>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" placeholder="nome@esempio.it" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Nome</label>
                  <input type="text" placeholder="Nome" />
                </div>
                <div className={styles.field}>
                  <label>Cognome</label>
                  <input type="text" placeholder="Cognome" />
                </div>
              </div>
              <div className={styles.field}>
                <label>Indirizzo</label>
                <input type="text" placeholder="Via, Piazza..." />
              </div>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label>Città</label>
                  <input type="text" placeholder="Città" />
                </div>
                <div className={styles.field}>
                  <label>CAP</label>
                  <input type="text" placeholder="CAP" />
                </div>
              </div>
            </div>
          </section>

          <section className={styles.block}>
            <h3>2. Metodo di pagamento</h3>
            <div className={styles.paymentMethods}>
              <div className={`${styles.method} ${styles.active}`}>
                <input type="radio" checked readOnly />
                <label>Carta di Credito / Stripe</label>
              </div>
              <div className={styles.method}>
                <input type="radio" disabled />
                <label>PayPal (Prossimamente)</label>
              </div>
            </div>
          </section>
        </div>

        <aside className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Riepilogo Ordine</h3>
            <div className={styles.itemList}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemName}>
                    {item.name} <span>x{item.quantity}</span>
                  </div>
                  <div className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} €</div>
                </div>
              ))}
            </div>
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotale</span>
                <span>{getTotal().toFixed(2)} €</span>
              </div>
              <div className={styles.totalRow}>
                <span>Spedizione</span>
                <span>Gratis</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Totale</span>
                <span>{getTotal().toFixed(2)} €</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}>
              Paga Ora
            </button>
            <p className={styles.secure}>🔒 Pagamento crittografato e sicuro</p>
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
