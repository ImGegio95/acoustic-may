"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import styles from "@/app/admin/page.module.css";
import AdminProductModal from "./AdminProductModal";

export default function AdminHeader({ categories, attributes }: { categories: any[], attributes: any[] }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div>
          <div className={styles.tag}>Gestione Store</div>
          <h1>Dashboard Amministratore</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Nuovo Prodotto
        </button>
      </header>

      {showModal && (
        <AdminProductModal 
          categories={categories}
          attributes={attributes} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}
