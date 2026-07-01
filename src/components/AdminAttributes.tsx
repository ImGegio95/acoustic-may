"use client";

import { useState } from "react";
import { updateAttribute, updateAttrValue, createAttribute, createAttrValue } from "@/lib/db-actions";
import styles from "@/app/admin/page.module.css";
import { Settings, Save, Palette, Type, Plus } from "lucide-react";

interface AdminAttributesProps {
  attributes: any[];
}

export default function AdminAttributes({ attributes }: AdminAttributesProps) {
  const [loading, setLoading] = useState<number | null>(null);
  const [newAttr, setNewAttr] = useState({ name: '', slug: '' });
  const [newVals, setNewVals] = useState<Record<number, { value: string, hexColor: string }>>({});

  const handleToggleDisplay = async (attrId: number, currentType: string) => {
    setLoading(attrId);
    const newType = currentType === "text" ? "color" : "text";
    await updateAttribute(attrId, { displayType: newType });
    setLoading(null);
  };

  const handleUpdateHex = async (valId: number, hex: string) => {
    await updateAttrValue(valId, { hexColor: hex });
  };

  const handleAddAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttr.name || !newAttr.slug) return;
    setLoading(-1);
    await createAttribute({ name: newAttr.name, slug: newAttr.slug, displayType: 'text' });
    setNewAttr({ name: '', slug: '' });
    setLoading(null);
  };

  const handleAddValue = async (attrId: number, e: React.FormEvent) => {
    e.preventDefault();
    const val = newVals[attrId];
    if (!val || !val.value) return;
    setLoading(attrId);
    await createAttrValue({ attributeId: attrId, value: val.value, hexColor: val.hexColor || null });
    setNewVals(prev => ({ ...prev, [attrId]: { value: '', hexColor: '' } }));
    setLoading(null);
  };

  const updateNewVal = (attrId: number, field: string, val: string) => {
    setNewVals(prev => ({
      ...prev,
      [attrId]: { ...(prev[attrId] || { value: '', hexColor: '' }), [field]: val }
    }));
  };

  return (
    <section className={styles.section} style={{ marginTop: '40px' }}>
      <div className={styles.sectionHeader}>
        <h2>Gestione Attributi Varianti</h2>
      </div>

      <div className={styles.attrList}>
        {attributes.map((attr) => (
          <div key={attr.id} className={styles.attrCard}>
            <div className={styles.attrHeader}>
              <div>
                <h3>{attr.name}</h3>
                <span className={styles.attrSlug}>{attr.slug}</span>
              </div>
              <button 
                className={`btn ${attr.displayType === 'color' ? 'btn-dark' : 'btn-outline'}`}
                onClick={() => handleToggleDisplay(attr.id, attr.displayType)}
                disabled={loading === attr.id}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {attr.displayType === 'color' ? <Palette size={14} style={{marginRight: '6px'}} /> : <Type size={14} style={{marginRight: '6px'}} />}
                Visualizza come {attr.displayType === 'color' ? 'Colore' : 'Testo'}
              </button>
            </div>

            <div className={styles.valuesGrid}>
              {attr.values?.map((val: any) => (
                <div key={val.id} className={styles.valRow}>
                  <span className={styles.valName}>{val.value}</span>
                  {attr.displayType === 'color' && (
                    <div className={styles.colorInputWrapper}>
                      <input 
                        type="color" 
                        defaultValue={val.hexColor || "#cccccc"} 
                        onBlur={(e) => handleUpdateHex(val.id, e.target.value)}
                        className={styles.colorPicker}
                      />
                      <input 
                        type="text" 
                        defaultValue={val.hexColor || "#cccccc"} 
                        onBlur={(e) => handleUpdateHex(val.id, e.target.value)}
                        className={styles.hexInput}
                        placeholder="#000000"
                      />
                    </div>
                  )}
                </div>
              ))}
              
              <form onSubmit={(e) => handleAddValue(attr.id, e)} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Nuovo valore..." 
                  className={styles.hexInput} 
                  value={newVals[attr.id]?.value || ''}
                  onChange={(e) => updateNewVal(attr.id, 'value', e.target.value)}
                  style={{ width: '100%', maxWidth: '200px' }}
                />
                {attr.displayType === 'color' && (
                  <div className={styles.colorInputWrapper}>
                    <input 
                      type="color" 
                      value={newVals[attr.id]?.hexColor || "#000000"} 
                      onChange={(e) => updateNewVal(attr.id, 'hexColor', e.target.value)}
                      className={styles.colorPicker}
                    />
                    <input 
                      type="text" 
                      value={newVals[attr.id]?.hexColor || ""} 
                      onChange={(e) => updateNewVal(attr.id, 'hexColor', e.target.value)}
                      className={styles.hexInput}
                      placeholder="#HEX"
                    />
                  </div>
                )}
                <button type="submit" className="btn btn-dark" disabled={loading === attr.id} style={{ padding: '6px' }}>
                  <Plus size={16} />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <form className={styles.attrCard} onSubmit={handleAddAttribute} style={{ marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Nome Attributo (es. Materiale)" 
          className={styles.hexInput} 
          value={newAttr.name}
          onChange={(e) => setNewAttr(p => ({ ...p, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))}
          style={{ flex: 1, padding: '10px' }}
        />
        <input 
          type="text" 
          placeholder="slug (auto)" 
          className={styles.hexInput} 
          value={newAttr.slug}
          onChange={(e) => setNewAttr(p => ({ ...p, slug: e.target.value }))}
          style={{ flex: 1, padding: '10px' }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading === -1}>
          <Plus size={16} style={{marginRight: '6px', display: 'inline-block'}} /> Aggiungi Attributo
        </button>
      </form>
    </section>
  );
}
