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

  let initialSpecs: { key: string, value: string }[] = [];
  try {
    if (product?.technicalSpecs) {
      const parsed = JSON.parse(product.technicalSpecs);
      if (Array.isArray(parsed)) {
        initialSpecs = parsed;
      } else if (typeof parsed === 'object') {
         initialSpecs = Object.entries(parsed).map(([k, v]) => ({ key: k, value: String(v) }));
      }
    }
  } catch(e) {
    // Era salvato come HTML (Tiptap), lo ignoriamo per ora
  }
  const [specsList, setSpecsList] = useState<{key: string, value: string}[]>(initialSpecs);

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
    technicalSheetUrl: product?.technicalSheetUrl || "",
  });

  const [uploadingPdf, setUploadingPdf] = useState(false);
  
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("file", file);

    setUploadingPdf(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, technicalSheetUrl: data.url });
      } else {
        alert("Errore upload: " + data.error);
      }
    } catch (err) {
      alert("Errore di rete durante upload");
    }
    setUploadingPdf(false);
  };

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

  const addSpec = () => setSpecsList([...specsList, { key: "", value: "" }]);
  const removeSpec = (idx: number) => {
    const s = [...specsList];
    s.splice(idx, 1);
    setSpecsList(s);
  };
  const updateSpec = (idx: number, field: 'key'|'value', val: string) => {
    const s = [...specsList];
    s[idx] = { ...s[idx], [field]: val };
    setSpecsList(s);
  };

  const handleVariantImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        updateVariant(idx, 'image', data.url);
      }
    } catch (err) {
      alert("Errore upload immagine variante");
    }
  };

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
        technicalSpecs: JSON.stringify(specsList),
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
          <h4>Specifiche e Manuali</h4>
          
          <div className={styles.field}>
            <label>Specifiche Tecniche</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {specsList.map((spec, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    placeholder="Es. Peso" 
                    value={spec.key} 
                    onChange={e => updateSpec(idx, 'key', e.target.value)} 
                    style={{ flex: 1 }}
                  />
                  <input 
                    placeholder="Es. 10 kg" 
                    value={spec.value} 
                    onChange={e => updateSpec(idx, 'value', e.target.value)} 
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => removeSpec(idx)} className={styles.iconBtnDanger}><Trash2 size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={addSpec} className="btn btn-outline" style={{ width: 'fit-content', marginTop: '4px' }}><Plus size={16} /> Aggiungi Specifica</button>
            </div>
          </div>

          <div className={styles.field}>
            <label>Scheda Tecnica / Manuale (PDF)</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <input 
                type="text" 
                value={formData.technicalSheetUrl} 
                onChange={e => setFormData({...formData, technicalSheetUrl: e.target.value})} 
                placeholder="URL del PDF (es. /uploads/manuale.pdf)"
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--paper2)', outline: 'none' }}
              />
              <label style={{ cursor: 'pointer', background: 'var(--ink)', color: 'var(--paper)', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {uploadingPdf ? "Caricamento..." : "Scegli File PDF"}
                <input type="file" accept=".pdf,application/pdf" style={{ display: 'none' }} onChange={handlePdfUpload} disabled={uploadingPdf} />
              </label>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--stone-d)', marginTop: '8px' }}>Seleziona un file PDF dal tuo computer oppure incolla un link esterno se è già caricato altrove.</p>
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
                      <th>Foto</th>
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
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={v.price} 
                              onChange={(e) => updateVariant(i, 'price', e.target.value)} 
                              style={{ padding: '8px', border: '1px solid var(--line)', borderRadius: '6px', width: '90px', fontSize: '13px' }}
                            />
                            <span style={{ color: 'var(--stone-d)', fontSize: '13px' }}>€</span>
                          </div>
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={v.stock} 
                            onChange={(e) => updateVariant(i, 'stock', parseInt(e.target.value) || 0)} 
                            style={{ padding: '8px', border: '1px solid var(--line)', borderRadius: '6px', width: '70px', fontSize: '13px' }}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
                            {v.image && <img src={v.image} style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} alt="Var" />}
                            <label style={{ cursor: 'pointer', fontSize: '12px', background: 'var(--paper2)', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                              {v.image ? 'Cambia' : 'Foto'}
                              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleVariantImageUpload(i, e)} />
                            </label>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => removeVariant(i)} className={styles.iconBtnDanger} title="Elimina Variante"><Trash2 size={14} /></button>
                          </div>
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
