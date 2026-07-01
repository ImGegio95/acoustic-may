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
      <div className={styles.eqBackground}>
        {Array.from({ length: 80 }).map((_, i) => {
          const delays = [0, 0.3, 0.6, 0.2, 0.8, 0.5, 0.1, 0.7, 0.4];
          const delay = delays[i % delays.length];
          return <div key={i} className={styles.eqBar} style={{ animationDelay: `${delay}s` }}></div>;
        })}
      </div>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {messages.map((m, i) => (
            <span key={`${m.id}-${i}`} className={styles.message}>
              {m.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
