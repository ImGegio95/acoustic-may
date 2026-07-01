import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import styles from "../page.module.css";
import { Building2, User, Search } from "lucide-react";
import Header from "@/components/Header";
import AdminNav from "@/components/AdminNav";

export default async function ClientiPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          
          <header className={styles.header}>
            <div>
              <div className={styles.tag}>Gestione Anagrafiche</div>
              <h1>Clienti Registrati</h1>
            </div>
          </header>

          <AdminNav />

          <section className={styles.section} style={{ marginTop: '24px' }}>
            <div className={styles.sectionHeader}>
              <div className={styles.headerLeft}>
                <h2 style={{ margin: 0 }}>Tutti i Clienti</h2>
                <p className={styles.pageDescription} style={{ marginTop: '8px' }}>Visualizza e gestisci le anagrafiche dei tuoi acquirenti.</p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contatti</th>
              <th>Tipo</th>
              <th>Dati Fiscali</th>
              <th>Data Reg.</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.length > 0 ? (
              allUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--obsidian)' }}>{user.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--stone-d)' }}>ID: {user.id}</div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--stone-dark)' }}>{user.email}</div>
                  </td>
                  <td>
                    {user.accountType === 'company' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0e7ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                        <Building2 size={14} /> Azienda
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                        <User size={14} /> Privato
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    {user.accountType === 'company' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div><span style={{ color: 'var(--stone-d)' }}>P.IVA:</span> <strong>{user.vatNumber || '-'}</strong></div>
                        <div><span style={{ color: 'var(--stone-d)' }}>SDI:</span> <strong>{user.sdi || '-'}</strong></div>
                        <div><span style={{ color: 'var(--stone-d)' }}>PEC:</span> <strong>{user.pec || '-'}</strong></div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div><span style={{ color: 'var(--stone-d)' }}>CF:</span> <strong>{user.taxCode || '-'}</strong></div>
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--stone-d)' }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--stone-d)' }}>
                  Nessun cliente registrato al momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
          </section>
        </div>
      </main>
    </>
  );
}
