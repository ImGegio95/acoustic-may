"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createProduct } from "@/lib/db-actions";
import styles from "@/app/admin/page.module.css";

export default function AdminProductModal({ categories, onClose }: { categories: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      price: formData.get("price"),
      description: formData.get("description"),
      categoryId: parseInt(formData.get("categoryId") as string),
      badge: formData.get("badge"),
    };

    try {
      await createProduct(data);
      onClose();
    } catch (error) {
      alert("Errore durante la creazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Aggiungi Nuovo Prodotto</h3>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        <form className={styles.modalForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label>Nome Prodotto</label>
              <input name="name" required placeholder="es. OUD 8 Floorstanding" />
            </div>
            <div className={styles.field}>
              <label>Slug (URL)</label>
              <input name="slug" required placeholder="es. oud-8-floorstanding" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.field}>
              <label>Prezzo (€)</label>
              <input name="price" type="number" step="0.01" required placeholder="2400" />
            </div>
            <div className={styles.field}>
              <label>Categoria</label>
              <select name="categoryId" required>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label>Badge</label>
            <select name="badge">
              <option value="">Nessuno</option>
              <option value="Novità">Novità</option>
              <option value="Best Seller">Best Seller</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Descrizione</label>
            <textarea name="description" rows={4} placeholder="Descrizione del prodotto..."></textarea>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Annulla</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Salvataggio...' : 'Crea Prodotto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
