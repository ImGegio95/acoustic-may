"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface ProductTabsProps {
  description: string | null;
  specs: string | null;
  sheetUrl: string | null;
}

export default function ProductTabs({ description, specs, sheetUrl }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "specs">("desc");

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', marginBottom: '24px', gap: '32px' }}>
        <button 
          onClick={() => setActiveTab("desc")}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '12px 0', 
            fontSize: '16px', 
            fontWeight: 600, 
            cursor: 'pointer',
            color: activeTab === "desc" ? 'var(--ink)' : 'var(--stone-d)',
            borderBottom: activeTab === "desc" ? '2px solid var(--copper)' : '2px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          Descrizione
        </button>
        {specs && specs.trim() !== "" && (
          <button 
            onClick={() => setActiveTab("specs")}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: '12px 0', 
              fontSize: '16px', 
              fontWeight: 600, 
              cursor: 'pointer',
              color: activeTab === "specs" ? 'var(--ink)' : 'var(--stone-d)',
              borderBottom: activeTab === "specs" ? '2px solid var(--copper)' : '2px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            Specifiche Tecniche
          </button>
        )}
      </div>

      <div>
        {activeTab === "desc" && (
          <div className="tiptap-editor-content" dangerouslySetInnerHTML={{ __html: description || '' }} style={{ color: 'var(--stone-dark)', lineHeight: '1.6' }} />
        )}
        {activeTab === "specs" && (
          <div>
            {(() => {
              if (!specs) return <p>Nessuna specifica tecnica disponibile.</p>;
              let parsedSpecs: any = [];
              try {
                parsedSpecs = JSON.parse(specs);
              } catch (e) {
                // Se è HTML vecchio
                return <div className="tiptap-editor-content" dangerouslySetInnerHTML={{ __html: specs }} style={{ color: 'var(--stone-dark)', lineHeight: '1.6' }} />;
              }
              
              if (!Array.isArray(parsedSpecs)) {
                // Se non è un array, proviamo a stamparlo come testo semplice se è una stringa o mostriamo errore.
                if (typeof parsedSpecs === 'string') {
                  return <div className="tiptap-editor-content" dangerouslySetInnerHTML={{ __html: parsedSpecs }} style={{ color: 'var(--stone-dark)', lineHeight: '1.6' }} />;
                }
                return <p>Specifiche in un formato non supportato.</p>;
              }
              
              if (parsedSpecs.length === 0) return <p>Nessuna specifica tecnica disponibile.</p>;
              
              return (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                  <tbody>
                    {parsedSpecs.map((s: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--line)', background: idx % 2 === 0 ? 'transparent' : 'var(--paper2)' }}>
                        <td style={{ padding: '16px', fontWeight: 600, color: 'var(--ink)', width: '30%' }}>{s.key}</td>
                        <td style={{ padding: '16px', color: 'var(--stone-dark)' }}>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        )}
      </div>

      {sheetUrl && (
        <div style={{ marginTop: '40px', padding: '24px', background: 'var(--paper2)', borderRadius: '12px', border: '1px solid var(--line)' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Manuale e Documentazione</h4>
          <p style={{ color: 'var(--stone-d)', fontSize: '14px', margin: '0 0 16px 0' }}>Scarica la scheda tecnica ufficiale in formato PDF.</p>
          <a 
            href={sheetUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Download size={16} /> Scarica PDF
          </a>
        </div>
      )}
    </div>
  );
}
