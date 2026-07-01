import Link from "next/link";
import { Package, Mail, ShoppingBag, Users, Truck, FolderTree, Megaphone } from "lucide-react";

export default function AdminNav() {
  return (
    <nav className="admin-nav" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
      <Link href="/admin" className="btn btn-outline" style={{ background: 'white', whiteSpace: 'nowrap' }}>
        <Package size={16} /> Catalogo & Prodotti
      </Link>
      <Link href="/admin/categorie" className="btn btn-outline" style={{ background: 'white', whiteSpace: 'nowrap' }}>
        <FolderTree size={16} /> Categorie
      </Link>
      <Link href="/admin/annunci" className="btn btn-outline" style={{ background: 'white', whiteSpace: 'nowrap' }}>
        <Megaphone size={16} /> Avvisi (Barra)
      </Link>
      <Link href="/admin/ordini" className="btn btn-outline" style={{ background: 'white', whiteSpace: 'nowrap' }}>
        <ShoppingBag size={16} /> Gestione Ordini
      </Link>
      <Link href="/admin/spedizioni" className="btn btn-outline" style={{ background: 'white', whiteSpace: 'nowrap' }}>
        <Truck size={16} /> Gestione Spedizioni
      </Link>
      <Link href="/admin/email" className="btn btn-outline" style={{ background: 'white', whiteSpace: 'nowrap' }}>
        <Mail size={16} /> Email Transazionali
      </Link>
      <Link href="/admin/clienti" className="btn btn-outline" style={{ background: 'white', whiteSpace: 'nowrap' }}>
        <Users size={16} /> Rubrica Clienti
      </Link>
    </nav>
  );
}
