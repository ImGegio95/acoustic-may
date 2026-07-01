"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import styles from "@/app/prodotto/[slug]/page.module.css";
import { ShoppingCart, Heart } from "lucide-react";

interface PDPActionsProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    category: string;
    image?: string | null;
  }
}

export default function PDPActions({ product }: PDPActionsProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price.replace(',', '.')),
      quantity: qty,
      category: product.category,
      image: product.image || undefined
    });
  };

  return (
    <>
      <div className={styles.qtyRow}>
        <div className={styles.qtyBox}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>
      </div>
      
      <div className={styles.pdpCta}>
        <button 
          className="btn btn-dark" 
          onClick={handleAddToCart}
          style={{ flex: 1, borderRadius: '100px', justifyContent: 'center' }}
        >
          <ShoppingCart size={18} strokeWidth={1.5} style={{ marginRight: '10px' }} />
          Aggiungi al carrello — {(parseFloat(product.price.replace(',', '.')) * qty).toFixed(2)} €
        </button>
        <button className={styles.iconSquare} aria-label="Aggiungi ai preferiti">
          <Heart size={20} strokeWidth={1.5} />
        </button>
      </div>
    </>
  );
}
