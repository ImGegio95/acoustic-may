import { db } from "@/db";
import { announcements } from "@/db/schema";
import { asc } from "drizzle-orm";
import Header from "@/components/Header";
import AdminNav from "@/components/AdminNav";
import styles from "../page.module.css";
import { addAnnouncement } from "./actions";
import { Plus } from "lucide-react";
import AnnouncementRow from "./AnnouncementRow";

export default async function AnnunciPage() {
  const options = await db.select().from(announcements).orderBy(asc(announcements.sortOrder));

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          <header className={styles.header}>
            <div>
              <h1>Barra Avvisi</h1>
              <p>Gestisci i messaggi scorrevoli in cima al sito.</p>
            </div>
          </header>
          <AdminNav />
          <div className={styles.content}>
            <section className={styles.block}>
              <div className={styles.sectionHeader}>
                <div className={styles.headerLeft}>
                  <h2 style={{ margin: 0 }}>Nuovo Messaggio Barra Avvisi</h2>
                  <p style={{ color: 'var(--stone-d)', margin: '4px 0 0 0', fontSize: '14px' }}>Aggiungi un messaggio che scorrerà in cima a tutte le pagine.</p>
                </div>
              </div>
              
              <form action={addAnnouncement} style={{ display: 'flex', gap: '16px', background: 'var(--paper2)', padding: '24px', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '40px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Testo dell'Avviso *</label>
                  <input required type="text" name="text" placeholder="Es: Spedizione gratuita per ordini superiori a 500€ 🎉" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} />
                </div>
                <div>
                  <button type="submit" className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}><Plus size={16} /> Aggiungi</button>
                </div>
              </form>

              <div className={styles.sectionHeader}>
                <div className={styles.headerLeft}>
                  <h2 style={{ margin: 0 }}>Messaggi Attivi</h2>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Testo Messaggio</th>
                      <th>Stato</th>
                      <th style={{ textAlign: 'right' }}>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {options.length === 0 ? (
                      <tr><td colSpan={3} style={{ textAlign: 'center', padding: '24px' }}>Nessun messaggio creato.</td></tr>
                    ) : options.map((opt) => (
                      <AnnouncementRow key={opt.id} ann={opt} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
