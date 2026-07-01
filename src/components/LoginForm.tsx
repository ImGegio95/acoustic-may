"use client";

import { useState } from "react";
import { loginAction } from "@/lib/auth-actions";
import styles from "@/app/mio-account/page.module.css";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.errorMsg}>{error}</div>}
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" required placeholder="admin@acousticmay.it" />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" required placeholder="••••••••" />
        <a href="#" className={styles.forgot}>Password dimenticata?</a>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? 'Accesso in corso...' : 'Accedi ora'}
      </button>
    </form>
  );
}
