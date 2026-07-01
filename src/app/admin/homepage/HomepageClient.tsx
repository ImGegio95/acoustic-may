"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { Save, Plus, Trash2 } from "lucide-react";
import { saveHomepageSettings } from "./actions";

export default function HomepageClient({ 
  products, 
  initialNovita, 
  initialBestseller,
  initialBrands
}: { 
  products: any[], 
  initialNovita: number[], 
  initialBestseller: number[],
  initialBrands: string[]
}) {
  const [novita, setNovita] = useState<number[]>(initialNovita);
  const [bestseller, setBestseller] = useState<number[]>(initialBestseller);
  const [brands, setBrands] = useState<string[]>(initialBrands);
  const [newBrand, setNewBrand] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const toggleNovita = (id: number) => {
    setNovita(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleBestseller = (id: number) => {
    setBestseller(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const addBrand = () => {
    if (newBrand.trim() !== "" && !brands.includes(newBrand.trim().toUpperCase())) {
      setBrands([...brands, newBrand.trim().toUpperCase()]);
      setNewBrand("");
    }
  };

  const removeBrand = (b: string) => {
    setBrands(brands.filter(brand => brand !== b));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveHomepageSettings(novita, bestseller, brands);
    setIsSaving(false);
    alert("Home Page aggiornata con successo!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      <section className={styles.block}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h2 style={{ margin: 0 }}>Novità in collezione</h2>
            <p style={{ color: 'var(--stone-d)', fontSize: '14px', margin: '4px 0 0' }}>Seleziona fino a 4 prodotti da mostrare nel primo blocco della Home.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {products.map(p => (
            <div 
              key={p.id} 
              onClick={() => toggleNovita(p.id)}
              style={{ padding: '16px', border: '1px solid var(--line)', borderRadius: '8px', cursor: 'pointer', background: novita.includes(p.id) ? '#f0f9ff' : 'var(--paper2)', borderColor: novita.includes(p.id) ? '#3b82f6' : 'var(--line)' }}
            >
              <input type="checkbox" checked={novita.includes(p.id)} readOnly style={{ marginRight: '8px' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h2 style={{ margin: 0 }}>Best seller</h2>
            <p style={{ color: 'var(--stone-d)', fontSize: '14px', margin: '4px 0 0' }}>Seleziona fino a 4 prodotti da mostrare nel secondo blocco della Home.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {products.map(p => (
            <div 
              key={p.id} 
              onClick={() => toggleBestseller(p.id)}
              style={{ padding: '16px', border: '1px solid var(--line)', borderRadius: '8px', cursor: 'pointer', background: bestseller.includes(p.id) ? '#f0fdf4' : 'var(--paper2)', borderColor: bestseller.includes(p.id) ? '#22c55e' : 'var(--line)' }}
            >
              <input type="checkbox" checked={bestseller.includes(p.id)} readOnly style={{ marginRight: '8px' }} />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <h2 style={{ margin: 0 }}>Marchi in Evidenza (Striscia Scorrevole)</h2>
            <p style={{ color: 'var(--stone-d)', fontSize: '14px', margin: '4px 0 0' }}>Gestisci i brand che appaiono nel nastro scorrevole a metà della Home Page.</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Nuovo Marchio</label>
            <input 
              type="text" 
              value={newBrand}
              onChange={e => setNewBrand(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addBrand()}
              placeholder="Es: DAYTON AUDIO" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', textTransform: 'uppercase' }} 
            />
          </div>
          <button onClick={addBrand} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', height: '44px' }}>
            <Plus size={16} /> Aggiungi
          </button>
        </div>

        {brands.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {brands.map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--paper2)', border: '1px solid var(--line)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                {b}
                <button onClick={() => removeBrand(b)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone-d)', display: 'flex', alignItems: 'center', padding: 0 }} title="Rimuovi">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--stone-d)', fontSize: '14px', fontStyle: 'italic' }}>Nessun marchio inserito. La striscia non sarà visibile.</p>
        )}
      </section>

      <div style={{ position: 'sticky', bottom: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} disabled={isSaving} className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 32px', fontSize: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <Save size={20} /> {isSaving ? "Salvataggio..." : "Salva Impostazioni"}
        </button>
      </div>

    </div>
  );
}
