"use client";

import { useState } from "react";
import { sendContactEmail } from "@/lib/email-actions";
import styles from "@/app/contatti/page.module.css";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);
    
    if (result.error) {
      setStatus({ type: 'error', message: result.error });
    } else {
      setStatus({ type: 'success', message: "Messaggio inviato con successo! Ti risponderemo il prima possibile." });
      (e.target as HTMLFormElement).reset();
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.formBox}>
      <h2 className={styles.formTitle}>Inviaci un messaggio</h2>
      
      {status && (
        <div style={{ 
          padding: '16px', 
          borderRadius: '12px', 
          marginBottom: '24px', 
          backgroundColor: status.type === 'success' ? '#e6f4ea' : '#fce8e6', 
          color: status.type === 'success' ? '#137333' : '#c5221f',
          fontWeight: 500,
          fontSize: '14px'
        }}>
          {status.message}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" placeholder="Il tuo nome" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="la-tua@email.it" required />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="subject">Oggetto</label>
          <select id="subject" name="subject" required>
            <option value="Informazioni prodotti">Informazioni prodotti</option>
            <option value="Progetto su misura">Progetto su misura</option>
            <option value="Assistenza tecnica">Assistenza tecnica</option>
            <option value="Altro">Altro</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="message">Messaggio</label>
          <textarea id="message" name="message" rows={4} placeholder="Come possiamo aiutarti?" required></textarea>
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Invio in corso...' : 'Invia Messaggio'}
        </button>
      </form>
    </div>
  );
}
