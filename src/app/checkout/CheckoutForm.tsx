"use client";

import { useCartStore } from "@/lib/store";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, CreditCard } from "lucide-react";

export default function CheckoutForm({ dbUser, shippingOptions }: { dbUser: any, shippingOptions?: any[] }) {
  const { items, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(shippingOptions && shippingOptions.length > 0 ? shippingOptions[0].id : null);
  
  const [formData, setFormData] = useState({
    email: dbUser?.email || "",
    name: dbUser?.name || "",
    accountType: dbUser?.accountType || "private",
    taxCode: dbUser?.taxCode || "",
    vatNumber: dbUser?.vatNumber || "",
    pec: dbUser?.pec || "",
    sdi: dbUser?.sdi || "",
    bStreet: "", bNumber: "", bCity: "", bProvince: "", bZip: "", bRegion: "",
    sStreet: "", sNumber: "", sCity: "", sProvince: "", sZip: "", sRegion: ""
  });
  const [sameShipping, setSameShipping] = useState(true);

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
  const selectedOpt = (shippingOptions || []).find(o => o.id === selectedShippingId);
  let shipping = 0;
  if (selectedOpt) {
    shipping = Number(selectedOpt.price);
    if (selectedOpt.minOrderValue && subtotal >= Number(selectedOpt.minOrderValue)) {
      shipping = 0;
    }
  } else {
    shipping = subtotal > 100 ? 0 : 9.90;
  }
  const total = subtotal + shipping;
  const iva = total - (total / 1.22);

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
          sdi: formData.sdi,
          shippingOptionId: selectedShippingId,
          billingAddress: `${formData.bStreet} ${formData.bNumber}, ${formData.bZip} ${formData.bCity} (${formData.bProvince}), ${formData.bRegion}`,
          shippingAddress: sameShipping 
            ? `${formData.bStreet} ${formData.bNumber}, ${formData.bZip} ${formData.bCity} (${formData.bProvince}), ${formData.bRegion}`
            : `${formData.sStreet} ${formData.sNumber}, ${formData.sZip} ${formData.sCity} (${formData.sProvince}), ${formData.sRegion}`
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
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo.webp" 
              alt="Acoustic May Logo" 
              width={140} 
              height={35} 
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <div className={styles.steps}>
            <span className={styles.active}><Lock size={14} style={{ marginRight: '6px' }}/> Checkout Sicuro</span>
          </div>
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
                
                <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
                  <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Indirizzo di Fatturazione</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                      <label>Via / Piazza *</label>
                      <input required type="text" name="bStreet" value={formData.bStreet} onChange={handleChange} />
                    </div>
                    <div className={styles.field}>
                      <label>Civico *</label>
                      <input required type="text" name="bNumber" value={formData.bNumber} onChange={handleChange} />
                    </div>
                    <div className={styles.field}>
                      <label>CAP *</label>
                      <input required type="text" name="bZip" value={formData.bZip} onChange={handleChange} />
                    </div>
                    <div className={styles.field}>
                      <label>Città *</label>
                      <input required type="text" name="bCity" value={formData.bCity} onChange={handleChange} />
                    </div>
                    <div className={styles.field}>
                      <label>Provincia (Sigla) *</label>
                      <input required type="text" name="bProvince" value={formData.bProvince} onChange={handleChange} maxLength={2} style={{ textTransform: 'uppercase' }} />
                    </div>
                    <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                      <label>Regione *</label>
                      <input required type="text" name="bRegion" value={formData.bRegion} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '16px', marginBottom: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                    <input 
                      type="checkbox" 
                      checked={sameShipping} 
                      onChange={(e) => setSameShipping(e.target.checked)} 
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    L'indirizzo di spedizione è uguale a quello di fatturazione
                  </label>
                </div>

                {!sameShipping && (
                  <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
                    <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Indirizzo di Spedizione</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                        <label>Via / Piazza *</label>
                        <input required type="text" name="sStreet" value={formData.sStreet} onChange={handleChange} />
                      </div>
                      <div className={styles.field}>
                        <label>Civico *</label>
                        <input required type="text" name="sNumber" value={formData.sNumber} onChange={handleChange} />
                      </div>
                      <div className={styles.field}>
                        <label>CAP *</label>
                        <input required type="text" name="sZip" value={formData.sZip} onChange={handleChange} />
                      </div>
                      <div className={styles.field}>
                        <label>Città *</label>
                        <input required type="text" name="sCity" value={formData.sCity} onChange={handleChange} />
                      </div>
                      <div className={styles.field}>
                        <label>Provincia (Sigla) *</label>
                        <input required type="text" name="sProvince" value={formData.sProvince} onChange={handleChange} maxLength={2} style={{ textTransform: 'uppercase' }} />
                      </div>
                      <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                        <label>Regione *</label>
                        <input required type="text" name="sRegion" value={formData.sRegion} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {shippingOptions && shippingOptions.length > 0 && (
                <div style={{ background: 'var(--paper2)', padding: '24px', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '32px' }}>
                  <h4 style={{ marginBottom: '16px' }}>Metodo di Spedizione</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {shippingOptions.map((opt) => {
                      const isFree = opt.minOrderValue && subtotal >= Number(opt.minOrderValue);
                      const finalPrice = isFree ? 0 : Number(opt.price);
                      
                      return (
                        <label key={opt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid', borderColor: selectedShippingId === opt.id ? 'var(--copper)' : 'var(--line)', borderRadius: '8px', cursor: 'pointer', background: 'var(--paper)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input 
                              type="radio" 
                              name="shippingOpt" 
                              value={opt.id} 
                              checked={selectedShippingId === opt.id}
                              onChange={() => setSelectedShippingId(opt.id)}
                            />
                            <div>
                              <div style={{ fontWeight: 600 }}>{opt.name}</div>
                              {opt.description && <div style={{ fontSize: '13px', color: 'var(--stone-d)' }}>{opt.description}</div>}
                            </div>
                          </div>
                          <div style={{ fontWeight: 600 }}>
                            {finalPrice === 0 ? 'Gratis' : `${finalPrice.toFixed(2)} €`}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                style={{ width: '100%', padding: '16px', fontSize: '18px', textAlign: 'center', justifyContent: 'center' }}
                disabled={loading}
              >
                {loading ? "Generazione Checkout..." : "Procedi al Pagamento"}
              </button>
            </form>
          </section>
        </div>

        <aside className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>Riepilogo Ordine</h3>
            <div className={styles.itemList}>
              {items.map((item, i) => (
                <div key={i} className={styles.itemRow} style={{ alignItems: 'center', gap: '12px' }}>
                  {item.image && (
                    <Image src={item.image} width={50} height={50} alt={item.name} style={{ borderRadius: '6px', objectFit: 'cover' }} />
                  )}
                  <div className={styles.itemInfo} style={{ flex: 1 }}>
                    <span className={styles.itemName} style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>{item.name}</span>
                    <span className={styles.itemQty} style={{ display: 'block', color: 'var(--stone-d)', fontSize: '12px' }}>Qtà: {item.quantity}</span>
                  </div>
                  <div className={styles.itemPrice} style={{ fontWeight: 600 }}>
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
              <span>Totale (IVA incl.)</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            
            <div className={styles.totalsRow} style={{ marginTop: '12px', justifyContent: 'flex-end', fontSize: '12px' }}>
              <span>di cui IVA (22%): {iva.toFixed(2)} €</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
