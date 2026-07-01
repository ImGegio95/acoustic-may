"use client";

import { useState } from "react";
import { Trash2, Edit3 } from "lucide-react";
import { deleteProduct } from "@/lib/db-actions";
import styles from "@/app/admin/page.module.css";

export default function AdminProductTable({ products }: { products: any[] }) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    
    setIsDeleting(id);
    try {
      await deleteProduct(id);
    } catch (error) {
      alert("Errore durante l'eliminazione");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Immagine</th>
            <th>Nome Prodotto</th>
            <th>Categoria</th>
            <th>Prezzo</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ opacity: isDeleting === p.id ? 0.5 : 1 }}>
              <td>
                <div className={styles.prodThumb}>
                  {p.name.charAt(0)}
                </div>
              </td>
              <td className={styles.prodName}>
                <strong>{p.name}</strong>
                <span>/{p.slug}</span>
              </td>
              <td>{p.category?.name || "Nessuna"}</td>
              <td>{p.price} €</td>
              <td>
                <span className={`${styles.status} ${styles.active}`}>Attivo</span>
              </td>
              <td className={styles.actions}>
                <button className={styles.actionBtn} title="Modifica">
                  <Edit3 size={16} />
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.delete}`} 
                  title="Elimina"
                  onClick={() => handleDelete(p.id)}
                  disabled={isDeleting === p.id}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
