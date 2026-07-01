"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import styles from "@/app/admin/page.module.css";
import { createProduct, updateProduct } from "@/lib/db-actions";
import dynamic from "next/dynamic";
const TiptapEditor = dynamic(() => import("./TiptapEditor"), { ssr: false, loading: () => <div style={{ height: '200px', background: 'var(--paper2)', borderRadius: '12px' }}></div> });

export default function AdminProductModal({ product, categories, attributes, onClose }: { product?: any, categories: any[], attributes: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const initialImages = product?.images ? JSON.parse(product.images) : (product?.image ? [product.image] : []);
  const [imagesList, setImagesList] = useState<string[]>(initialImages);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    categoryId: product?.categoryId || "",
    type: product?.type || "simple",
    seoTitle: product?.seoTitle || "",
    seoDescription: product?.seoDescription || "",
    badge: product?.badge || "",
  });

  const moveImgUp = (idx: number) => {
    if (idx === 0) return;
    const newImgs = [...imagesList];
    [newImgs[idx - 1], newImgs[idx]] = [newImgs[idx], newImgs[idx - 1]];
    setImagesList(newImgs);
  };

  const moveImgDown = (idx: number) => {
    if (idx === imagesList.length - 1) return;
    const newImgs = [...imagesList];
    [newImgs[idx + 1], newImgs[idx]] = [newImgs[idx], newImgs[idx + 1]];
    setImagesList(newImgs);
  };

  const removeImg = (idx: number) => {
    const newImgs = [...imagesList];
    newImgs.splice(idx, 1);
    setImagesList(newImgs);
  };

  const addImg = () => {
    setImagesList([...imagesList, ""]);
  };

  const [variants, setVariants] = useState<any[]>(product?.variants || []);
  const [newVar, setNewVar] = useState({ name: "", price: "", stock: 0 });
  const [newVarAttrs, setNewVarAttrs] = useState<Record<number, number>>({});

  const handleAddVariant = () => {
    if (!newVar.name) {
      alert("Inserisci un nome per la variante");
      return;
    }
    setVariants([...variants, { ...newVar, tempId: Date.now(), selectedAttrs: newVarAttrs }]);
    setNewVar({ name: "", price: "", stock: 0 });
    setNewVarAttrs({});
  };

  const removeVariant = (idx: number) => {
    const v = [...variants];
    v.splice(idx, 1);
    setVariants(v);
  };

  const updateVariant = (idx: number, field: string, value: any) => {
    const v = [...variants];
    v[idx] = { ...v[idx], [field]: value };
    setVariants(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        image: imagesList.length > 0 ? imagesList[0] : "",
        images: JSON.stringify(imagesList),
        variants: variants
      };

      if (product) {
        await updateProduct(product.id, dataToSave);
      } else {
        await createProduct(dataToSave);
      }
      onClose();
    } catch (error) {
      alert("Errore durante il salvataggio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{product ? "Modifica Prodotto" : "Nuovo Prodotto"}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className={styles.modalBody}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Nome Prodotto</label>
              <input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div className={styles.field}>
              <label>Slug</label>
              <input 
                value={formData.slug} 
                onChange={e => setFormData({...formData, slug: e.target.value})} 
                required 
              />
            </div>
            <div className={styles.field}>
              <label>Categoria</label>
              <select 
                value={formData.categoryId} 
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                required
              >
                <option value="">Seleziona...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label>Prezzo (€)</label>
              <input 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                required 
              />
            </div>
            <div className={styles.field}>
              <label>Tipo Prodotto</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="simple">Semplice</option>
                <option value="variable">Variabile</option>
              </select>
            </div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Galleria Immagini (URL)</label>
              <div className={styles.galleryManager}>
                {imagesList.map((img, idx) => (
                  <div key={idx} className={styles.galleryItem}>
                    <div className={styles.galleryItemLeft}>
                       {img ? <img src={img} alt="thumb" className={styles.galleryThumb} /> : <div className={styles.galleryThumbPlaceholder}>?</div>}
                       <input 
                         value={img} 
                         onChange={(e) => {
                           const newImgs = [...imagesList];
                           newImgs[idx] = e.target.value;
                           setImagesList(newImgs);
                         }}
                         placeholder="URL Immagine (es. /products/bontone-black.webp)"
                         style={{ flex: 1, padding: '10px', border: '1px solid var(--line)', borderRadius: '6px', background: 'var(--paper2)', outline: 'none' }}
                       />
                    </div>
                    <div className={styles.galleryItemActions}>
                       <button type="button" onClick={() => moveImgUp(idx)} disabled={idx === 0} className={styles.iconBtn}>↑</button>
                       <button type="button" onClick={() => moveImgDown(idx)} disabled={idx === imagesList.length - 1} className={styles.iconBtn}>↓</button>
                       <button type="button" onClick={() => removeImg(idx)} className={styles.iconBtnDanger}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addImg} className="btn btn-outline" style={{ marginTop: '4px', width: 'fit-content' }}><Plus size={16} /> Aggiungi Immagine</button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--stone-d)', marginTop: '8px' }}>La prima immagine in alto sarà utilizzata come immagine principale (copertina) del prodotto.</p>
            </div>
          </div>

          <div className={styles.field}>
            <label>Descrizione (Editor Premium)</label>
            <TiptapEditor 
              value={formData.description} 
              onChange={val => setFormData({...formData, description: val})}
            />
          </div>

          <hr className={styles.hr} />
          <h4>SEO & Marketing</h4>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>SEO Title</label>
              <input 
                value={formData.seoTitle} 
                onChange={e => setFormData({...formData, seoTitle: e.target.value})} 
              />
            </div>
            <div className={styles.field}>
              <label>Badge (es: Nuovo, Offerta)</label>
              <input 
                value={formData.badge} 
                onChange={e => setFormData({...formData, badge: e.target.value})} 
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>SEO Description</label>
            <textarea 
              rows={2} 
              value={formData.seoDescription} 
              onChange={e => setFormData({...formData, seoDescription: e.target.value})}
            />
          </div>

          {formData.type === "variable" && (
            <>
              <hr className={styles.hr} />
              <h4>Varianti Prodotto</h4>
              <p style={{ fontSize: '12px', color: 'var(--stone-d)', marginBottom: '16px' }}>
                Aggiungi le varianti specificando nome, attributi (es. colore, formato), prezzo e quantità.
              </p>
              
              <div style={{ background: '#fdfdfd', padding: '24px', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--line)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '20px' }}>
                  <div className={styles.field} style={{ marginBottom: 0 }}>
                    <label>Nome Variante (es. Small, 500ml)</label>
                    <input value={newVar.name} onChange={e => setNewVar({...newVar, name: e.target.value})} placeholder="Nome variante" style={{ background: 'white' }} />
                  </div>
                  <div className={styles.field} style={{ marginBottom: 0 }}>
                    <label>Prezzo Extra (€)</label>
                    <input type="number" step="0.01" value={newVar.price} onChange={e => setNewVar({...newVar, price: e.target.value})} placeholder="Es. 29.90" style={{ background: 'white' }} />
                  </div>
                  <div className={styles.field} style={{ marginBottom: 0 }}>
                    <label>Stock</label>
                    <input type="number" value={newVar.stock} onChange={e => setNewVar({...newVar, stock: parseInt(e.target.value) || 0})} placeholder="Q.tà" style={{ background: 'white' }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  {attributes.map(attr => (
                    <div key={attr.id} className={styles.field} style={{ marginBottom: 0, minWidth: '180px' }}>
                      <label>{attr.name}</label>
                      <select 
                        value={newVarAttrs[attr.id] || ""} 
                        onChange={e => setNewVarAttrs({...newVarAttrs, [attr.id]: parseInt(e.target.value)})}
                        style={{ background: 'white' }}
                      >
                        <option value="">Nessuno</option>
                        {attr.values.map((v: any) => <option key={v.id} value={v.id}>{v.value}</option>)}
                      </select>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddVariant} className="btn btn-dark" style={{ padding: '12px 20px', minWidth: '140px' }}>
                    <Plus size={16} /> Aggiungi
                  </button>
                </div>
              </div>

              {variants.length > 0 && (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Variante</th>
                      <th>Prezzo</th>
                      <th>Stock</th>
                      <th style={{ textAlign: 'right' }}>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v, i) => (
                      <tr key={i}>
                        <td>
                          <input 
                            value={v.name} 
                            onChange={(e) => updateVariant(i, 'name', e.target.value)} 
                            style={{ padding: '8px', border: '1px solid var(--line)', borderRadius: '6px', width: '100%', fontSize: '13px', fontWeight: 600 }}
                          />
                        </td>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input 
                            type="number" 
                            step="0.01" 
                            value={v.price} 
                            onChange={(e) => updateVariant(i, 'price', e.target.value)} 
                            style={{ padding: '8px', border: '1px solid var(--line)', borderRadius: '6px', width: '90px', fontSize: '13px' }}
                          />
                          <span style={{ color: 'var(--stone-d)', fontSize: '13px' }}>€</span>
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={v.stock} 
                            onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value) || 0)} 
                            style={{ padding: '8px', border: '1px solid var(--line)', borderRadius: '6px', width: '70px', fontSize: '13px' }}
                          />
                        </td>
                        <td className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => removeVariant(i)} className={styles.iconBtnDanger} title="Elimina Variante"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          </div>
          <div className={styles.modalFooter}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Annulla</button>
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? "Salvataggio..." : "Salva Prodotto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
