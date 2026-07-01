"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegistrationForm() {
  const router = useRouter();
  const [type, setType] = useState<"private" | "company">("private");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    taxCode: "",
    vatNumber: "",
    pec: "",
    sdi: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, accountType: type })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Errore durante la registrazione");
        setLoading(false);
        return;
      }

      // Login automatico dopo la registrazione
      const signInRes = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (signInRes?.error) {
        setError("Account creato ma login automatico fallito.");
        setLoading(false);
      } else {
        router.push("/mio-account");
        router.refresh();
      }

    } catch (err) {
      setError("Errore di rete. Riprova più tardi.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.typeToggle}>
        <button 
          type="button" 
          className={`${styles.typeBtn} ${type === 'private' ? styles.active : ''}`}
          onClick={() => setType("private")}
        >
          Privato
        </button>
        <button 
          type="button" 
          className={`${styles.typeBtn} ${type === 'company' ? styles.active : ''}`}
          onClick={() => setType("company")}
        >
          Azienda / P.IVA
        </button>
      </div>

      <div className={styles.formGrid}>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label>{type === 'company' ? 'Ragione Sociale' : 'Nome e Cognome'} *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        
        <div className={styles.field}>
          <label>Email *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className={styles.field}>
          <label>Password *</label>
          <input required type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>

        {type === 'private' && (
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label>Codice Fiscale *</label>
            <input required type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} style={{ textTransform: 'uppercase' }} />
          </div>
        )}

        {type === 'company' && (
          <>
            <div className={styles.field}>
              <label>Partita IVA *</label>
              <input required type="text" name="vatNumber" value={formData.vatNumber} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Codice Fiscale</label>
              <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} style={{ textTransform: 'uppercase' }} />
            </div>
            <div className={styles.field}>
              <label>Codice SDI</label>
              <input type="text" name="sdi" value={formData.sdi} onChange={handleChange} style={{ textTransform: 'uppercase' }} maxLength={7} />
            </div>
            <div className={styles.field}>
              <label>Indirizzo PEC</label>
              <input type="email" name="pec" value={formData.pec} onChange={handleChange} />
            </div>
          </>
        )}
      </div>

      <button 
        type="submit" 
        className="btn btn-dark" 
        style={{ width: '100%', marginTop: '32px', padding: '16px', fontSize: '15px' }}
        disabled={loading}
      >
        {loading ? "Creazione in corso..." : "Crea Account"}
      </button>
      
      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--stone-d)' }}>
        Hai già un account? <a href="/mio-account" style={{ color: 'var(--obsidian)', fontWeight: 600 }}>Accedi qui</a>
      </p>
    </form>
  );
}
