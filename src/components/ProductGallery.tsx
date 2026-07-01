"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import styles from "./ProductGallery.module.css";
import { useGalleryStore } from "@/lib/store";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || "/placeholder.webp");
  const [isZoomed, setIsZoomed] = useState(false);
  
  const activeVariantImage = useGalleryStore((s) => s.activeVariantImage);
  const setActiveVariantImage = useGalleryStore((s) => s.setActiveVariantImage);

  useEffect(() => {
    if (activeVariantImage) {
      setActiveImage(activeVariantImage);
    }
  }, [activeVariantImage]);

  return (
    <>
      <div className={styles.gallery}>
        <div className={styles.galleryMain} onClick={() => setIsZoomed(true)}>
          <div className={styles.imgContainer}>
            <Image 
              src={activeImage} 
              alt={productName} 
              fill 
              className={styles.mainImg}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <button className={styles.zoomBtn} aria-label="Ingrandisci immagine">
            <ZoomIn size={18} /> Zoom
          </button>
        </div>
        {images.length > 1 && (
          <div className={styles.thumbRow}>
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`${styles.thumb} ${activeImage === img ? styles.active : ""}`}
                onClick={() => {
                  setActiveImage(img);
                  if (activeVariantImage) setActiveVariantImage(null);
                }}
              >
                <Image src={img} alt={`${productName} thumbnail ${idx}`} fill style={{ objectFit: 'cover', borderRadius: '6px' }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {isZoomed && (
        <div className={styles.modalOverlay} onClick={() => setIsZoomed(false)}>
          <button className={styles.closeBtn} onClick={() => setIsZoomed(false)}>
            <X size={32} />
          </button>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.zoomedImgWrapper}>
              <Image 
                src={activeImage} 
                alt={productName} 
                fill
                className={styles.zoomedImg}
                sizes="90vw"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
