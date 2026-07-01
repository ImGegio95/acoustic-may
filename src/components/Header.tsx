"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useCartStore } from "@/lib/store";
import { Search, Heart, ShoppingBag } from "lucide-react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleCart, items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const handleCartClick = () => {
    console.log("Cart clicked, toggling...");
    toggleCart();
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className={`${styles.siteHeader} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerTop}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '34px' }}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo.webp" 
              alt="Acoustic May Logo" 
              width={160} 
              height={40} 
              className={styles.logoImg}
            />
          </Link>
          <nav className={styles.nav}>
            <Link href="/catalogo?cat=studio-monitor">Studio Monitor</Link>
            <Link href="/catalogo?cat=garden-audio">Garden Audio</Link>
            <Link href="/catalogo?cat=home-hifi">Home Hi-Fi</Link>
            <Link href="/catalogo?cat=accessori">Accessori</Link>
            <Link href="/chi-siamo">Chi siamo</Link>
            <Link href="/contatti">Contatti</Link>
          </nav>
        </div>
        <div className={styles.headerIcons}>
          <Link href="/catalogo" className={styles.iconBtn} aria-label="Cerca">
            <Search size={20} strokeWidth={1.5} />
          </Link>
          <Link href="#" className={styles.iconBtn} aria-label="Preferiti">
            <Heart size={20} strokeWidth={1.5} />
          </Link>
          <button className={styles.iconBtn} onClick={handleCartClick} aria-label="Carrello">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {mounted && cartCount > 0 && (
              <span className={styles.cartDot}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
