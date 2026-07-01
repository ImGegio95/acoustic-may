"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function ProfileDashboard({ user }: { user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: user.name || "",
    taxCode: user.taxCode || "",
    vatNumber: user.vatNumber || "",
    pec: user.pec || "",
    sdi: user.sdi || "",
    billingAddress: user.billingAddress || "",
    shippingAddress: user.shippingAddress || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "Profilo aggiornato con successo!" });
        router.refresh();
      } else {
        setMsg({ type: "error", text: data.error || "Errore di salvataggio." });
      }
    } catch (err) {
      setMsg({ type: "error", text: "Errore di rete." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid var(--line)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
      <h2 style={{ marginBottom: '24px' }}>I miei Dati</h2>
      {msg.text && (
        <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', background: msg.type === 'success' ? '#ecfdf5' : '#fef2f2', color: msg.type === 'success' ? '#10b981' : '#ef4444' }}>
          {msg.text}
        </div>
      )}
      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--stone-d)', marginBottom: '8px' }}>Nome / Ragione Sociale</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '8px' }} />
        </div>
        
        {user.accountType === 'company' ? (
          <>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--stone-d)', marginBottom: '8px' }}>Partita IVA</label>
              <input type="text" name="vatNumber" value={formData.vatNumber} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--stone-d)', marginBottom: '8px' }}>Codice Fiscale</label>
              <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '8px', textTransform: 'uppercase' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--stone-d)', marginBottom: '8px' }}>SDI</label>
              <input type="text" name="sdi" value={formData.sdi} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '8px', textTransform: 'uppercase' }} maxLength={7} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--stone-d)', marginBottom: '8px' }}>PEC</label>
              <input type="email" name="pec" value={formData.pec} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '8px' }} />
            </div>
          </>
        ) : (
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--stone-d)', marginBottom: '8px' }}>Codice Fiscale</label>
            <input type="text" name="taxCode" value={formData.taxCode} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '8px', textTransform: 'uppercase' }} />
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--stone-d)', marginBottom: '8px' }}>Indirizzo di Spedizione Completo</label>
          <textarea name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '8px', resize: 'vertical' }} placeholder="Via, CAP, Città, Provincia..."></textarea>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--stone-d)', marginBottom: '8px' }}>Indirizzo di Fatturazione (se diverso)</label>
          <textarea name="billingAddress" value={formData.billingAddress} onChange={handleChange} rows={3} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '8px', resize: 'vertical' }} placeholder="Via, CAP, Città, Provincia..."></textarea>
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
          <button type="submit" className="btn btn-dark" disabled={loading} style={{ padding: '14px 24px' }}>
            {loading ? "Salvataggio..." : "Salva Modifiche"}
          </button>
        </div>
      </form>
    </div>
  );
}
