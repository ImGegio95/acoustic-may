"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0] || "/placeholder.webp");

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryMain}>
        <Image 
          src={activeImage} 
          alt={productName} 
          fill 
          className={styles.mainImg}
          priority
        />
        <div className={styles.zoomTag}>⤢ Zoom</div>
      </div>
      {images.length > 1 && (
        <div className={styles.thumbRow}>
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`${styles.thumb} ${activeImage === img ? styles.active : ""}`}
              onClick={() => setActiveImage(img)}
            >
              <Image src={img} alt={`${productName} thumbnail ${idx}`} fill style={{ objectFit: 'cover', borderRadius: '6px' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
