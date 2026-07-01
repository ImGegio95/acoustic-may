"use client";

import { useState } from "react";
import styles from "../page.module.css";
import { Plus, FolderTree, Trash2, Edit2 } from "lucide-react";
import CategoryModal from "./CategoryModal";
import { deleteCategory } from "./actions";
import Image from "next/image";

export default function CategoryClientPage({ categories }: { categories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<any>(null);

  const openNew = () => {
    setSelectedCat(null);
    setIsModalOpen(true);
  };

  const openEdit = (cat: any) => {
    setSelectedCat(cat);
    setIsModalOpen(true);
  };

  return (
    <section className={styles.block}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerLeft}>
          <h2 style={{ margin: 0 }}>Gestione Categorie</h2>
        </div>
        <button onClick={openNew} className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Nuova Categoria
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Immagine</th>
              <th>Nome</th>
              <th>Slug</th>
              <th>SEO Title</th>
              <th style={{ textAlign: 'right' }}>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>Nessuna categoria trovata.</td></tr>
            ) : categories.map(cat => (
              <tr key={cat.id}>
                <td style={{ width: '80px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', position: 'relative', background: 'var(--paper2)' }}>
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <FolderTree size={20} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--stone-d)' }} />
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{cat.name}</td>
                <td><code style={{ fontSize: '12px', background: 'var(--paper2)', padding: '4px 8px', borderRadius: '4px' }}>/{cat.slug}</code></td>
                <td>{cat.seoTitle ? <span style={{ color: '#10b981', fontWeight: 600 }}>Impostato</span> : <span style={{ color: '#ef4444' }}>Mancante</span>}</td>
                <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center', height: '48px' }}>
                  <button onClick={() => openEdit(cat)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center' }} title="Modifica">
                    <Edit2 size={16} />
                  </button>
                  <form action={async () => { await deleteCategory(cat.id); }}>
                    <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }} title="Elimina">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cat={selectedCat} />
      )}
    </section>
  );
}
