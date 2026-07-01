"use client";

import { useCartStore } from "@/lib/store";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";

export default function CheckoutForm({ dbUser }: { dbUser: any }) {
  const { items, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: dbUser?.email || "",
    name: dbUser?.name || "",
    accountType: dbUser?.accountType || "private",
    taxCode: dbUser?.taxCode || "",
    vatNumber: dbUser?.vatNumber || "",
    pec: dbUser?.pec || "",
    sdi: dbUser?.sdi || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const subtotal = getTotal();
  const shipping = subtotal > 100 ? 0 : 9.90;
  const total = subtotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerEmail: formData.email,
          customerName: formData.name,
          userId: dbUser?.id || null,
          accountType: formData.accountType,
          taxCode: formData.taxCode,
          vatNumber: formData.vatNumber,
          pec: formData.pec,
          sdi: formData.sdi
        })
      });
      const data = await res.json();
      if (data.url) {
        // Reindirizza al server sicuro di Stripe
        window.location.href = data.url;
      } else {
        alert("Errore durante la creazione del pagamento: " + data.error);
        setLoading(false);
      }
    } catch (e) {
      alert("Errore di rete. Riprova.");
      setLoading(false);
    }
  };

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
          <span className={styles.active}><Lock size={14} style={{ marginRight: '6px' }}/> Checkout Sicuro</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formSection}>
          <section className={styles.block}>
            <h3>Dati di contatto</h3>
            <p style={{ color: 'var(--stone-d)', fontSize: '14px', marginBottom: '24px' }}>
              Inserisci la tua email per ricevere la conferma dell'ordine. Ti verrà chiesto l'indirizzo di spedizione al prossimo step.
            </p>
            <form onSubmit={handleCheckout}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                  <label>Tipo di Acquisto</label>
                  <select name="accountType" value={formData.accountType} onChange={handleChange} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <option value="private">Privato</option>
                    <option value="company">Azienda / P.IVA</option>
                  </select>
                </div>
                
                <div className={styles.field}>
                  <label>Nome / Ragione Sociale *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                
                <div className={styles.field}>
                  <label>Email *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>

                {formData.accountType === 'private' && (
                  <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                    <label>Codice Fiscale *</label>
                    <input required type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} style={{ textTransform: 'uppercase' }} />
                  </div>
                )}

                {formData.accountType === 'company' && (
                  <>
                    <div className={styles.field}>
                      <label>Partita IVA *</label>
                      <input required type="text" name="vatNumber" value={formData.vatNumber} onChange={handleChange} />
                    </div>
                    <div className={styles.field}>
                      <label>Codice Fiscale (opzionale)</label>
                      <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} style={{ textTransform: 'uppercase' }} />
                    </div>
                    <div className={styles.field}>
                      <label>SDI (Codice Destinatario)</label>
                      <input type="text" name="sdi" value={formData.sdi} onChange={handleChange} maxLength={7} style={{ textTransform: 'uppercase' }} />
                    </div>
                    <div className={styles.field}>
                      <label>PEC</label>
                      <input type="email" name="pec" value={formData.pec} onChange={handleChange} />
                    </div>
                  </>
                )}
              </div>

              <div style={{ background: 'var(--paper2)', padding: '24px', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <ShieldCheck size={24} color="#10b981" />
                  <h4 style={{ margin: 0 }}>Pagamento Sicuro Garantito</h4>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--stone-d)', margin: 0, lineHeight: 1.5 }}>
                  Cliccando su "Procedi", verrai reindirizzato sui server certificati PCI DSS di Stripe per inserire l'indirizzo di spedizione e la tua carta in totale sicurezza. Nessun dato della carta verrà salvato sui nostri server.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', color: 'var(--stone-dark)' }}>
                  <CreditCard size={20} />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Supporta: Visa, Mastercard, Amex, Apple Pay, Google Pay</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-dark" 
                style={{ width: '100%', padding: '16px', fontSize: '18px' }}
                disabled={loading}
              >
                {loading ? "Generazione Checkout..." : "Procedi al Pagamento Sicuro"}
              </button>
            </form>
          </section>
        </div>

        <aside className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Riepilogo Ordine</h3>
            <div className={styles.itemList}>
              {items.map((item, i) => (
                <div key={i} className={styles.itemRow}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQty}>Qtà: {item.quantity}</span>
                  </div>
                  <div className={styles.itemPrice}>
                    {Number(item.price * item.quantity).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.totalsRow}>
              <span>Subtotale</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className={styles.totalsRow}>
              <span>Spedizione</span>
              <span>{shipping === 0 ? "Gratis" : `${shipping.toFixed(2)} €`}</span>
            </div>
            
            <div className={styles.finalTotal}>
              <span>Totale</span>
              <span>{total.toFixed(2)} €</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
