"use client";

import { useState } from "react";
import { Shield, Save } from "lucide-react";
import { updateSetting } from "@/lib/db-actions";
import styles from "@/app/admin/page.module.css";

export default function AdminSettings({ initialMode, initialIps }: { initialMode: boolean, initialIps: string }) {
  const [mode, setMode] = useState(initialMode);
  const [ips, setIps] = useState(initialIps);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateSetting("maintenance_mode", mode ? "true" : "false");
      await updateSetting("allowed_ips", ips);
      alert("Impostazioni salvate con successo");
    } catch (error) {
      alert("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} style={{ marginTop: '40px' }}>
      <div className={styles.sectionHeader}>
        <h2><Shield size={20} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Sicurezza e Manutenzione</h2>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={loading}
        >
          <Save size={18} /> {loading ? 'Salvataggio...' : 'Salva Impostazioni'}
        </button>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.field}>
          <label>Modalità Manutenzione</label>
          <div className={styles.toggleWrapper}>
            <input 
              type="checkbox" 
              checked={mode} 
              onChange={(e) => setMode(e.target.checked)}
              id="maintenance-toggle"
            />
            <label htmlFor="maintenance-toggle" className={styles.toggleLabel}>
              {mode ? 'ATTIVA - Sito non accessibile al pubblico' : 'DISATTIVATA - Sito pubblico'}
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label>IP Consentiti (Whitelist)</label>
          <p className={styles.fieldDesc}>Inserisci gli indirizzi IP separati da virgola che possono vedere il sito anche in manutenzione.</p>
          <input 
            value={ips} 
            onChange={(e) => setIps(e.target.value)}
            placeholder="es. 127.0.0.1, 151.24.12.5"
          />
        </div>
      </div>
    </section>
  );
}
