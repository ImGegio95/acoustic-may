"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AdminNav from "@/components/AdminNav";
import styles from "@/app/admin/page.module.css";
import { getEmailTemplates, updateEmailTemplate } from "@/lib/orders-actions";
import { getSetting, updateSetting } from "@/lib/db-actions";
import dynamic from "next/dynamic";
const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), { ssr: false, loading: () => <div style={{ height: '200px', background: 'var(--paper2)', borderRadius: '12px' }}></div> });

export default function AdminEmailPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("order_shipped");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [globalHeader, setGlobalHeader] = useState("");
  const [globalFooter, setGlobalFooter] = useState("");

  useEffect(() => {
    async function fetchTemplates() {
      const data = await getEmailTemplates();
      setTemplates(data);
      
      const current = data.find((t: any) => t.triggerEvent === selectedEvent);
      if (current) {
        setSubject(current.subject);
        setBodyHtml(current.bodyHtml);
      } else {
        // Default fallbacks
        if (selectedEvent === 'order_shipped') {
          setSubject("Il tuo ordine {{NUMERO_ORDINE}} è stato spedito!");
          setBodyHtml("<p>Ciao {{NOME_CLIENTE}},</p><p>Ti informiamo che il tuo ordine è stato affidato al corriere.</p><p>Puoi tracciare la spedizione cliccando su questo link: <a href='{{TRACKING_URL}}'>{{TRACKING_URL}}</a></p><p>Grazie per aver scelto Acoustic May!</p>");
        }
      }
      
      const header = await getSetting("email_header");
      const footer = await getSetting("email_footer");
      
      // Default modern layout if empty
      setGlobalHeader(header || "<div style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;\"><div style=\"background: #121212; padding: 32px 24px; text-align: center;\"><img src=\"https://www.acousticmay.it/logo.png\" alt=\"Acoustic May\" style=\"max-width: 180px; height: auto;\" /></div><div style=\"padding: 32px 24px; background: #faf8f4; color: #121212;\">");
      setGlobalFooter(footer || "</div><div style=\"background: #f4f2ee; padding: 24px; text-align: center; font-size: 12px; color: #7a7468; line-height: 1.6;\"><p><strong>Acoustic May</strong><br/>Via [Indirizzo], [Città] ([PROV]) [CAP]<br/>P.IVA: [Tua Partita IVA]<br/><a href=\"https://www.acousticmay.it\" style=\"color: #121212; text-decoration: underline;\">www.acousticmay.it</a></p></div></div>");
      
      setLoaded(true);
    }
    fetchTemplates();
  }, [selectedEvent]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (activeTab === 'templates') {
      await updateEmailTemplate(selectedEvent, subject, bodyHtml);
    } else {
      await updateSetting("email_header", globalHeader);
      await updateSetting("email_footer", globalFooter);
    }
    setSaving(false);
    alert(activeTab === 'templates' ? "Template salvato con successo!" : "Impostazioni Globali salvate!");
  };

  return (
    <>
      <Header />
      <main className={styles.adminPage}>
        <div className="container">
          
          <header className={styles.header}>
            <div>
              <div className={styles.tag}>Comunicazioni</div>
              <h1>Email Transazionali</h1>
            </div>
          </header>

          <AdminNav />

          <section className={styles.section} style={{ marginTop: '24px' }}>
            <div className={styles.sectionHeader}>
              <h2>Gestione Messaggistica</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
              <button 
                onClick={() => setActiveTab('templates')} 
                className={`btn ${activeTab === 'templates' ? 'btn-dark' : 'btn-outline'}`}
              >
                Template Specifici
              </button>
              <button 
                onClick={() => setActiveTab('global')} 
                className={`btn ${activeTab === 'global' ? 'btn-dark' : 'btn-outline'}`}
              >
                Header e Footer Globali
              </button>
            </div>
            
            {activeTab === 'templates' && (
              <p style={{ color: 'var(--stone-d)', fontSize: '14px', marginBottom: '24px' }}>
                Personalizza il corpo delle email che il sistema invia automaticamente ai clienti. L'Header e il Footer globali verranno aggiunti automaticamente.
                <br/><br/>
                <code style={{ background: 'var(--paper2)', padding: '4px 8px', borderRadius: '6px' }}>{`{{NOME_CLIENTE}}`}</code>
                <code style={{ background: 'var(--paper2)', padding: '4px 8px', borderRadius: '6px', margin: '0 8px' }}>{`{{NUMERO_ORDINE}}`}</code>
                <code style={{ background: 'var(--paper2)', padding: '4px 8px', borderRadius: '6px' }}>{`{{TRACKING_URL}}`}</code>
                <code style={{ background: 'var(--paper2)', padding: '4px 8px', borderRadius: '6px', margin: '0 8px' }}>{`{{TOTALE}}`}</code>
              </p>
            )}

            {loaded && activeTab === 'templates' && (
              <form onSubmit={handleSave} style={{ maxWidth: '800px' }}>
                <div className={styles.field} style={{ marginBottom: '24px' }}>
                  <label>Evento Scatenante</label>
                  <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
                    <option value="order_shipped">Ordine Spedito (Con Tracking)</option>
                    {/* Future expansion: <option value="order_created">Ordine Ricevuto</option> */}
                  </select>
                </div>

                <div className={styles.field} style={{ marginBottom: '24px' }}>
                  <label>Oggetto dell'Email</label>
                  <input 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                    placeholder="Es: Il tuo ordine è in viaggio!" 
                    required 
                  />
                </div>

                <div className={styles.field} style={{ marginBottom: '24px' }}>
                  <label>Corpo dell'Email</label>
                  <TiptapEditor 
                    value={bodyHtml} 
                    onChange={setBodyHtml}
                  />
                </div>

                <button type="submit" className="btn btn-dark" disabled={saving}>
                  {saving ? "Salvataggio in corso..." : "Salva Template"}
                </button>
              </form>
            )}

            {loaded && activeTab === 'global' && (
              <form onSubmit={handleSave} style={{ maxWidth: '800px' }}>
                <div className={styles.field} style={{ marginBottom: '24px' }}>
                  <label>Header Globale (Codice HTML o Testo Visivo)</label>
                  <p style={{ fontSize: '12px', color: 'var(--stone-d)', marginBottom: '8px' }}>
                    Si consiglia di inserire tag strutturali se si è esperti, altrimenti usate l'editor visivo. 
                    Ricordatevi che questo contenuto andrà <strong>SOPRA</strong> al corpo dell'email.
                  </p>
                  <TiptapEditor 
                    value={globalHeader} 
                    onChange={setGlobalHeader}
                  />
                </div>

                <div className={styles.field} style={{ marginBottom: '24px' }}>
                  <label>Footer Globale (Codice HTML o Testo Visivo)</label>
                  <p style={{ fontSize: '12px', color: 'var(--stone-d)', marginBottom: '8px' }}>
                    Questo contenuto andrà <strong>SOTTO</strong> al corpo dell'email (es. Indirizzo, Copyright, Social).
                  </p>
                  <TiptapEditor 
                    value={globalFooter} 
                    onChange={setGlobalFooter}
                  />
                </div>

                <button type="submit" className="btn btn-dark" disabled={saving}>
                  {saving ? "Salvataggio in corso..." : "Salva Header & Footer"}
                </button>
              </form>
            )}

          </section>

        </div>
      </main>
    </>
  );
}
