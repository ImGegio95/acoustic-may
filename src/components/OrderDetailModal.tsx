"use client";

import { useState, useEffect } from "react";
import { X, Truck, Package, CreditCard, Save } from "lucide-react";
import styles from "@/app/admin/page.module.css";
import { getOrderById, updateOrderStatus } from "@/lib/orders-actions";

export default function OrderDetailModal({ orderId, onClose }: { orderId: number, onClose: () => void }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState("");
  const [shippingStatus, setShippingStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getOrderById(orderId);
      setOrder(data);
      if (data) {
        setPaymentStatus(data.paymentStatus || "aperto");
        setShippingStatus(data.shippingStatus || "aperto");
        setOrderStatus(data.orderStatus || "aperto");
        setTrackingUrl(data.trackingUrl || "");
      }
      setLoading(false);
    }
    load();
  }, [orderId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (order.paymentStatus !== paymentStatus) await updateOrderStatus(orderId, 'payment', paymentStatus);
    if (order.orderStatus !== orderStatus) await updateOrderStatus(orderId, 'order', orderStatus);
    if (order.shippingStatus !== shippingStatus || order.trackingUrl !== trackingUrl) {
      await updateOrderStatus(orderId, 'shipping', shippingStatus, trackingUrl);
    }

    setSaving(false);
    onClose();
  };

  if (loading || !order) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} style={{ maxWidth: '800px' }}>
        <div className={styles.modalHeader}>
          <div>
            <h3>Ordine {order.orderNumber}</h3>
            <p style={{ fontSize: '13px', color: 'var(--stone-d)' }}>Effettuato il {new Date(order.createdAt).toLocaleDateString('it-IT')}</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className={styles.modalBody}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--paper2)', padding: '20px', borderRadius: '16px' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={16} /> Dati Cliente
                </h4>
                <p><strong>{order.customerName}</strong></p>
                <p>{order.customerEmail}</p>
                <p>{order.customerPhone}</p>
              </div>
              <div style={{ background: 'var(--paper2)', padding: '20px', borderRadius: '16px' }}>
                <h4 style={{ marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={16} /> Indirizzo di Spedizione
                </h4>
                <p>{order.shippingAddress || "N/A"}</p>
              </div>
            </div>

            <hr className={styles.hr} />
            <h4>Aggiornamento Stati</h4>
            <div className={styles.formGrid} style={{ marginTop: '16px' }}>
              <div className={styles.field}>
                <label><CreditCard size={12} style={{ display: 'inline', marginRight: '4px' }}/> Stato Pagamento</label>
                <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                  <option value="aperto">Aperto (In attesa)</option>
                  <option value="pagato">Pagato</option>
                  <option value="annullato">Annullato</option>
                  <option value="rimborsato">Rimborsato</option>
                </select>
                {(paymentStatus === 'annullato' || paymentStatus === 'rimborsato') && order.paymentStatus !== paymentStatus && (
                  <p style={{ fontSize: '11px', color: '#ca8a04', marginTop: '6px' }}>* Un'email automatica avviserà il cliente.</p>
                )}
              </div>
              
              <div className={styles.field}>
                <label><Truck size={12} style={{ display: 'inline', marginRight: '4px' }}/> Stato Spedizione</label>
                <select value={shippingStatus} onChange={e => setShippingStatus(e.target.value)}>
                  <option value="aperto">Da evadere</option>
                  <option value="in preparazione">In preparazione</option>
                  <option value="spedito">Spedito</option>
                </select>
                {shippingStatus === 'spedito' && order.shippingStatus !== 'spedito' && (
                  <p style={{ fontSize: '11px', color: '#10b981', marginTop: '6px' }}>* Un'email verrà inviata automaticamente al cliente al salvataggio.</p>
                )}
              </div>

              <div className={styles.field}>
                <label>Stato Generale Ordine</label>
                <select value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
                  <option value="aperto">Aperto</option>
                  <option value="in lavorazione">In lavorazione</option>
                  <option value="completato">Completato</option>
                  <option value="annullato">Annullato</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Tracking URL</label>
                <input 
                  type="url"
                  placeholder="https://gls-italy.com/track/..." 
                  value={trackingUrl} 
                  onChange={e => setTrackingUrl(e.target.value)} 
                />
              </div>
            </div>

            <hr className={styles.hr} />
            
            <h4>Prodotti Acquistati</h4>
            <table className={styles.table} style={{ marginTop: '16px' }}>
              <thead>
                <tr>
                  <th>Prodotto</th>
                  <th>Q.tà</th>
                  <th style={{ textAlign: 'right' }}>Prezzo Tot.</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.productName}</strong>
                      {item.variantName && <span style={{ display: 'block', fontSize: '12px', color: 'var(--stone-d)' }}>Variante: {item.variantName}</span>}
                    </td>
                    <td>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}><strong>{item.totalPrice} €</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <div style={{ background: '#fdfdfd', padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--line)', minWidth: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Subtotale:</span>
                  <span>{order.subtotal} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Spedizione:</span>
                  <span>{order.shippingCost} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
                  <span>Totale:</span>
                  <span>{order.total} €</span>
                </div>
              </div>
            </div>

          </div>
          <div className={styles.modalFooter}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Chiudi</button>
            <button type="submit" className="btn btn-dark" disabled={saving}>
              {saving ? "Salvataggio..." : "Aggiorna Ordine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
