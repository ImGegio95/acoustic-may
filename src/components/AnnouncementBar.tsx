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
      <div className={styles.marquee}>
        <div className={styles.track}>
          {messages.map((m, i) => (
            <span key={`${m.id}-${i}`} className={styles.message}>
              {m.text}
            </span>
          ))}
          {/* Duplicate to create a seamless infinite scrolling loop */}
          {messages.map((m, i) => (
            <span key={`dup-${m.id}-${i}`} className={styles.message}>
              {m.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
