"use client";

import styles from "./AnnouncementBar.module.css";
import { useEffect, useState } from "react";

export default function AnnouncementBar({ messages }: { messages: { id: number, text: string }[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || messages.length === 0) return null;

  return (
    <div className={styles.announcementBar}>
      <div className={styles.oscilloscopeContainer}>
        <div className={styles.wave1}></div>
        <div className={styles.wave2}></div>
        <div className={styles.wave3}></div>
        <div className={styles.wave4}></div>
      </div>
      <div className={styles.grid}>
        {messages.slice(0, 4).map((m, i) => (
          <div key={`${m.id}-${i}`} className={styles.gridItem}>
            <span className={styles.textGlass}>{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
