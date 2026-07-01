"use client";

import { useState } from "react";
import { MessageSquare, Trash2, Edit2, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { updateAnnouncement, toggleAnnouncement, deleteAnnouncement, moveAnnouncement } from "./actions";

export default function AnnouncementRow({ ann }: { ann: any }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <tr style={{ background: 'var(--paper2)' }}>
        <td colSpan={4} style={{ padding: '8px' }}>
          <form action={async (fd) => {
            await updateAnnouncement(fd);
            setIsEditing(false);
          }} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
            <input type="hidden" name="id" value={ann.id} />
            <input required type="text" name="text" defaultValue={ann.text} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--line)', width: '100%' }} />
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
        <MessageSquare size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--stone-d)' }}/>
        {ann.text}
      </td>
      <td>
        <form action={async () => { await toggleAnnouncement(ann.id, ann.isActive || false); }}>
          <button type="submit" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: ann.isActive ? '#dcfce7' : '#fee2e2', color: ann.isActive ? '#166534' : '#991b1b', border: 'none', cursor: 'pointer' }}>
            {ann.isActive ? "Visibile" : "Nascosto"}
          </button>
        </form>
      </td>
      <td style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
        <form action={async () => { await moveAnnouncement(ann.id, 'up'); }}>
          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--stone-dark)', display: 'flex', alignItems: 'center', padding: '4px' }} title="Sposta Su">
            <ArrowUp size={16} />
          </button>
        </form>
        <form action={async () => { await moveAnnouncement(ann.id, 'down'); }}>
          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--stone-dark)', display: 'flex', alignItems: 'center', padding: '4px' }} title="Sposta Giù">
            <ArrowDown size={16} />
          </button>
        </form>
        <button type="button" onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center', padding: '4px' }} title="Modifica">
          <Edit2 size={16} />
        </button>
        <form action={async () => { await deleteAnnouncement(ann.id); }}>
          <button type="submit" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: '4px' }} title="Elimina">
            <Trash2 size={16} />
          </button>
        </form>
      </td>
    </tr>
  );
}
