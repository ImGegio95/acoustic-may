"use client";

import { useCartStore } from "@/lib/store";
import styles from "./MiniCart.module.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X, Trash2, Plus, Minus } from "lucide-react";

export default function MiniCart() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  console.log("MiniCart rendering, isOpen:", isOpen);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ""}`} 
        onClick={toggleCart}
      />
      
      {/* Cart Sidebar */}
      <aside className={`${styles.cart} ${isOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h3>Carrello ({items.length})</h3>
          <button onClick={toggleCart} className={styles.closeBtn}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Il tuo carrello è vuoto.</p>
              <button onClick={toggleCart} className="btn btn-dark" style={{ marginTop: '20px' }}>
                Torna allo shopping
              </button>
            </div>
          ) : (
            <div className={styles.itemList}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImg}>
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className={styles.placeholder}></div>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemHead}>
                      <h4>{item.name}</h4>
                      <button onClick={() => removeItem(item.id)} className={styles.removeBtn}>
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className={styles.itemPrice}>{item.price.toFixed(2)} €</p>
                    <div className={styles.qtyBox}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={14} strokeWidth={1.5} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Totale</span>
              <span className={styles.totalPrice}>{getTotal().toFixed(2)} €</span>
            </div>
            <p className={styles.shippingInfo}>Spedizione e tasse calcolate al checkout.</p>
            <Link href="/checkout" onClick={toggleCart} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}>
              Procedi al Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
