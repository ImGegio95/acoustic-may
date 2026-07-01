"use client";

import { useState } from "react";
import { useCartStore, useGalleryStore } from "@/lib/store";
import styles from "@/app/prodotto/[slug]/page.module.css";
import { ShoppingCart, Heart } from "lucide-react";

interface PDPActionsProps {
  product: any;
  variants?: any[];
}

export default function PDPActions({ product, variants = [] }: PDPActionsProps) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const setActiveVariantImage = useGalleryStore((state) => state.setActiveVariantImage);

  const handleSelectVariant = (v: any) => {
    setSelectedVariant(v);
    if (v.image) {
      setActiveVariantImage(v.image);
    } else {
      setActiveVariantImage(null);
    }
  };

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const priceValue = typeof displayPrice === 'string' 
    ? parseFloat(displayPrice.replace(',', '.')) 
    : parseFloat(displayPrice.toString());

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      name: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name,
      slug: product.slug,
      price: priceValue,
      quantity: qty,
      category: product.category?.name || "Accessori",
      image: selectedVariant?.image || product.image || undefined,
      variantId: selectedVariant?.id
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const firstAttr = variants[0]?.attributes?.[0]?.attributeValue?.attribute;
  const attributeName = firstAttr?.name || "Opzione";
  const displayType = firstAttr?.displayType || "text";

  return (
    <>
      {product.type === "variable" && variants.length > 0 && (
        <div className={styles.variationSelector}>
          <label className={styles.attrLabel}>{attributeName}</label>
          <div className={styles.variationGrid}>
            {variants.map((v: any) => {
              const attrVal = v.attributes?.[0]?.attributeValue;
              if (displayType === "color") {
                return (
                  <button
                    key={v.id}
                    type="button"
                    className={`${styles.colorSwatch} ${selectedVariant?.id === v.id ? styles.activeSwatch : ""}`}
                    onClick={() => handleSelectVariant(v)}
                    title={attrVal?.value || v.name}
                  >
                    <span 
                      className={styles.colorCircle} 
                      style={{ 
                        backgroundColor: attrVal?.hexColor || "#ccc",
                        backgroundImage: attrVal?.imageUrl ? `url(${attrVal.imageUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  </button>
                );
              }
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`${styles.variationBtn} ${selectedVariant?.id === v.id ? styles.active : ""}`}
                  onClick={() => handleSelectVariant(v)}
                >
                  {attrVal?.value || v.name}
                </button>
              );
            })}
          </div>
          {selectedVariant && (
            <p className={styles.variantDesc}>{selectedVariant.description}</p>
          )}
        </div>
      )}

      <div className={styles.qtyRow}>
        <div className={styles.qtyBox}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} type="button">−</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)} type="button">+</button>
        </div>
      </div>
      
      <div className={styles.pdpCta}>
        <button 
          className="btn btn-dark" 
          onClick={handleAddToCart}
          disabled={(product.type === "variable" && !selectedVariant) || added}
          style={{ flex: 1, borderRadius: '100px', justifyContent: 'center' }}
        >
          {added ? (
            "Aggiunto al carrello!"
          ) : (
            <>
              <ShoppingCart size={18} strokeWidth={1.5} style={{ marginRight: '10px' }} />
              {product.type === "variable" && !selectedVariant 
                ? "Seleziona un'opzione" 
                : `Aggiungi — ${(priceValue * qty).toFixed(2)} €`}
            </>
          )}
        </button>
        <button 
          className={`${styles.iconSquare} ${isWishlisted ? styles.activeWish : ""}`} 
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Aggiungi ai preferiti"
          type="button"
        >
          <Heart size={20} strokeWidth={1.5} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
    </>
  );
}
