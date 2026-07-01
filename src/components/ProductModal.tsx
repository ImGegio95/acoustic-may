"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import styles from "@/app/admin/page.module.css";
import { createProduct, updateProduct } from "@/lib/db-actions";

export default function ProductModal({ product, categories, onClose }: { product?: any, categories: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    categoryId: product?.categoryId || "",
    image: product?.image || "",
    type: product?.type || "simple",
    seoTitle: product?.seoTitle || "",
    seoDescription: product?.seoDescription || "",
    badge: product?.badge || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
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
        
        <form onSubmit={handleSubmit} className={styles.modalBody}>
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
            <div className={styles.field}>
              <label>Immagine Principale (URL)</label>
              <input 
                value={formData.image} 
                onChange={e => setFormData({...formData, image: e.target.value})} 
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Descrizione</label>
            <textarea 
              rows={4} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
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
