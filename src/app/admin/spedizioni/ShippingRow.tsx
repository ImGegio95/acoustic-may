"use client";

import { useState } from "react";
import { Truck, Trash2, Edit2, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { updateShippingOption, toggleShippingOption, deleteShippingOption, moveShippingOption } from "./actions";

export default function ShippingRow({ opt }: { opt: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <tr style={{ background: 'var(--paper2)' }}>
        <td colSpan={6} style={{ padding: '8px' }}>
          <form action={async (fd) => {
            await updateShippingOption(fd);
            setIsEditing(false);
          }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
            <input type="hidden" name="id" value={opt.id} />
            <input required type="text" name="name" defaultValue={opt.name} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--line)', width: '100%' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input required type="number" step="0.01" name="price" defaultValue={opt.price} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--line)', width: '100%' }} /> €
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input type="number" step="0.01" name="minOrderValue" defaultValue={opt.minOrderValue || ""} placeholder="Soglia" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--line)', width: '100%' }} /> €
            </div>
            <input type="text" name="description" defaultValue={opt.description || ""} placeholder="Descrizione" style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--line)', width: '100%' }} />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Save size={14} /> Salva</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ background: 'transparent', color: 'var(--stone-d)', border: '1px solid var(--line)', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td style={{ fontWeight: 600 }}>
        <button type="button" onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600, color: 'var(--ink)' }}>
          <Truck size={14} style={{ display: 'inline', marginRight: '6px' }}/>{opt.name}
        </button>
      </td>
      <td>{opt.price} €</td>
      <td>{opt.minOrderValue ? `${opt.minOrderValue} €` : "-"}</td>
      <td style={{ color: 'var(--stone-d)' }}>{opt.description || "-"}</td>
      <td>
        <form action={async () => { await toggleShippingOption(opt.id, opt.isActive || false); }}>
          <button type="submit" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: opt.isActive ? '#dcfce7' : '#fee2e2', color: opt.isActive ? '#166534' : '#991b1b', border: 'none', cursor: 'pointer' }}>
            {opt.isActive ? "Attivo" : "Disattivato"}
          </button>
        </form>
      </td>
      <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
        <form action={async () => { await moveShippingOption(opt.id, 'up'); }}>
          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--stone-dark)', display: 'flex', alignItems: 'center', padding: '4px' }} title="Sposta Su">
            <ArrowUp size={16} />
          </button>
        </form>
        <form action={async () => { await moveShippingOption(opt.id, 'down'); }}>
          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--stone-dark)', display: 'flex', alignItems: 'center', padding: '4px' }} title="Sposta Giù">
            <ArrowDown size={16} />
          </button>
        </form>
        <button type="button" onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center', padding: '4px' }} title="Modifica">
          <Edit2 size={16} />
        </button>
        <form action={async () => { await deleteShippingOption(opt.id); }}>
          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: '4px' }} title="Elimina">
            <Trash2 size={16} />
          </button>
        </form>
      </td>
    </tr>
  );
}
