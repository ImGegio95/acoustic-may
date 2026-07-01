import { db } from "@/db";
import { shippingOptions } from "@/db/schema";
import Header from "@/components/Header";
import AdminNav from "@/components/AdminNav";
import styles from "../page.module.css";
import { addShippingOption, deleteShippingOption, toggleShippingOption } from "./actions";
import { Truck, Trash2, Plus } from "lucide-react";

export default async function SpedizioniPage() {
  const options = await db.select().from(shippingOptions);

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          <header className={styles.header}>
            <div>
              <div className={styles.tag}>Gestione Logistica</div>
              <h1>Metodi di Spedizione</h1>
            </div>
          </header>
          
          <AdminNav />

          <section className={styles.section} style={{ marginTop: '24px' }}>
            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <h2 style={{ margin: 0 }}>Nuova Spedizione</h2>
                <p className={styles.pageDescription} style={{ marginTop: '8px' }}>Crea una tariffa o un metodo (es. Corriere, Ritiro in sede).</p>
              </div>
            </div>
            
            <form action={addShippingOption} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', background: 'var(--paper2)', padding: '24px', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '40px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Nome Metodo *</label>
                <input required type="text" name="name" placeholder="Es: Corriere Espresso" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Prezzo (€) *</label>
                <input required type="number" step="0.01" name="price" placeholder="Es: 9.90 (0 per Gratis)" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Descrizione</label>
                <input type="text" name="description" placeholder="Es: Consegna in 24/48h" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16} /> Crea Opzione</button>
              </div>
            </form>

            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <h2 style={{ margin: 0 }}>Metodi Attivi</h2>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Prezzo</th>
                    <th>Descrizione</th>
                    <th>Stato</th>
                    <th style={{ textAlign: 'right' }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {options.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>Nessun metodo di spedizione creato.</td></tr>
                  ) : options.map((opt) => (
                    <tr key={opt.id}>
                      <td style={{ fontWeight: 600 }}><Truck size={14} style={{ display: 'inline', marginRight: '6px' }}/>{opt.name}</td>
                      <td>{opt.price} €</td>
                      <td style={{ color: 'var(--stone-d)' }}>{opt.description || "-"}</td>
                      <td>
                        <form action={async () => { "use server"; await toggleShippingOption(opt.id, opt.isActive || false); }}>
                          <button type="submit" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: opt.isActive ? '#dcfce7' : '#fee2e2', color: opt.isActive ? '#166534' : '#991b1b', border: 'none', cursor: 'pointer' }}>
                            {opt.isActive ? "Attivo" : "Disattivato"}
                          </button>
                        </form>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <form action={async () => { "use server"; await deleteShippingOption(opt.id); }}>
                          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={18} /></button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
