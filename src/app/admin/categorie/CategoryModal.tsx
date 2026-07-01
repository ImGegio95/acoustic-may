"use client";

import { useState, useRef } from "react";
import { X, Upload, Save, FolderTree } from "lucide-react";
import Image from "next/image";
import { addCategory, updateCategory } from "./actions";

export default function CategoryModal({ isOpen, onClose, cat = null }: { isOpen: boolean, onClose: () => void, cat?: any }) {
  const [activeTab, setActiveTab] = useState("general");
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(cat?.image || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImage(data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("image", image);
    
    if (cat) {
      formData.append("id", cat.id.toString());
      await updateCategory(formData);
    } else {
      await addCategory(formData);
    }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'var(--paper)', width: '90%', maxWidth: '800px', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderTree size={24} />
            {cat ? "Modifica Categoria" : "Nuova Categoria"}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', padding: '0 24px', gap: '24px' }}>
          <button type="button" onClick={() => setActiveTab("general")} style={{ padding: '16px 0', background: 'none', border: 'none', borderBottom: activeTab === "general" ? '2px solid var(--ink)' : '2px solid transparent', fontWeight: activeTab === "general" ? 600 : 400, cursor: 'pointer' }}>Generale</button>
          <button type="button" onClick={() => setActiveTab("seo")} style={{ padding: '16px 0', background: 'none', border: 'none', borderBottom: activeTab === "seo" ? '2px solid var(--ink)' : '2px solid transparent', fontWeight: activeTab === "seo" ? 600 : 400, cursor: 'pointer' }}>Impostazioni SEO</button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <form id="categoryForm" onSubmit={handleSubmit}>
            <div style={{ display: activeTab === "general" ? 'block' : 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '24px' }}>
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Nome Categoria *</label>
                    <input required type="text" name="name" defaultValue={cat?.name} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Slug (URL) *</label>
                    <input required type="text" name="slug" defaultValue={cat?.slug} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Descrizione</label>
                    <textarea name="description" defaultValue={cat?.description} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', resize: 'vertical' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>Immagine Copertina</label>
                  <div 
                    onClick={handleUploadClick}
                    style={{ border: '2px dashed var(--line)', borderRadius: '12px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', background: 'var(--paper2)' }}
                  >
                    {image ? (
                      <Image src={image} alt="Cover" fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--stone-d)' }}>
                        <Upload size={32} style={{ marginBottom: '8px' }} />
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{isUploading ? "Caricamento..." : "Carica Foto"}</div>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ display: activeTab === "seo" ? 'block' : 'none' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>Questi campi sono cruciali per farti trovare su Google. Se lasciati vuoti, Google proverà ad indovinarli leggendo il nome e la descrizione della categoria.</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>SEO Title</label>
                <input type="text" name="seoTitle" defaultValue={cat?.seoTitle} placeholder="Es: Diffusori da Giardino Professionali | Acoustic May" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }} />
                <span style={{ fontSize: '11px', color: 'var(--stone-d)', marginTop: '4px', display: 'block' }}>Ottimale: 50-60 caratteri.</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>SEO Description</label>
                <textarea name="seoDescription" defaultValue={cat?.seoDescription} rows={3} placeholder="Es: Scopri la nostra selezione di diffusori da giardino e accessori per esterni..." style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', resize: 'vertical' }} />
                <span style={{ fontSize: '11px', color: 'var(--stone-d)', marginTop: '4px', display: 'block' }}>Ottimale: 150-160 caratteri.</span>
              </div>
            </div>
          </form>
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button onClick={onClose} style={{ padding: '12px 24px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--line)', cursor: 'pointer', fontWeight: 600 }}>Annulla</button>
          <button type="submit" form="categoryForm" className="btn btn-dark" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} /> {cat ? "Salva Modifiche" : "Crea Categoria"}
          </button>
        </div>
      </div>
    </div>
  );
}
