"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import styles from "@/app/admin/page.module.css";
import OrderDetailModal from "./OrderDetailModal";

export default function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'aperto': return { bg: '#F4F2EE', color: '#7A7468' };
      case 'pagato': 
      case 'spedito': 
      case 'completato': return { bg: '#e6f6ee', color: '#10b981' };
      case 'annullato': return { bg: '#fee2e2', color: '#ef4444' };
      case 'rimborsato': return { bg: '#fef08a', color: '#ca8a04' }; // Giallo
      default: return { bg: '#e0f2fe', color: '#0284c7' };
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ordine #</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Totale</th>
            <th>Pagamento</th>
            <th>Spedizione</th>
            <th style={{ textAlign: 'right' }}>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {initialOrders.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                Nessun ordine presente.
              </td>
            </tr>
          ) : (
            initialOrders.map(order => (
              <tr key={order.id}>
                <td><strong>{order.orderNumber}</strong></td>
                <td>{new Date(order.createdAt).toLocaleDateString('it-IT')}</td>
                <td>
                  <div className={styles.prodName}>
                    <strong>{order.customerName}</strong>
                    <span>{order.customerEmail}</span>
                  </div>
                </td>
                <td><strong>{order.total} €</strong></td>
                <td>
                  <span className={styles.status} style={{ background: getStatusColor(order.paymentStatus).bg, color: getStatusColor(order.paymentStatus).color }}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={styles.status} style={{ background: getStatusColor(order.shippingStatus).bg, color: getStatusColor(order.shippingStatus).color }}>
                    {order.shippingStatus}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      type="button" 
                      className={styles.iconBtn} 
                      onClick={() => setSelectedOrder(order)}
                      title="Vedi Dettagli"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedOrder && (
        <OrderDetailModal 
          orderId={selectedOrder.id} 
          onClose={() => {
            setSelectedOrder(null);
            window.location.reload(); // Quick refresh to show updated data
          }} 
        />
      )}
    </div>
  );
}
