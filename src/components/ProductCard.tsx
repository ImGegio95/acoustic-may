"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import { useCartStore } from "@/lib/store";
import { Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    category: string;
    description: string;
    price: string;
    badge?: string | null;
    oldPrice?: string;
    image?: string | null;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price.replace(',', '.')),
      quantity: 1,
      category: product.category,
      image: product.image || undefined
    });
  };

  return (
    <Link href={`/prodotto/${product.slug}`} className={styles.pCard}>
      {product.badge && (
        <span className={`${styles.badge} ${product.badge.includes('-') ? styles.badgeCopper : ''}`}>
          {product.badge}
        </span>
      )}
      <button className={styles.wishBtn} aria-label="Aggiungi ai desideri">
        <Heart size={18} strokeWidth={1.5} />
      </button>
      <div className={styles.pImg}>
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className={styles.img}
          />
        ) : (
          <div className={styles.speaker}></div>
        )}
      </div>
      <div className={styles.pInfo}>
        <div className={styles.pCat}>{product.category}</div>
        <div className={styles.pName}>{product.name}</div>
        <div className={styles.pDesc}>{product.description}</div>
        <div className={styles.pPrice}>
          {product.oldPrice && <span className={styles.old}>{product.oldPrice}</span>}
          {product.price}
        </div>
      </div>
      <div className={styles.pBuy}>
        <button onClick={handleAddToCart}>
          <ShoppingCart size={16} strokeWidth={1.5} />
          Aggiungi
        </button>
      </div>
    </Link>
  );
}
