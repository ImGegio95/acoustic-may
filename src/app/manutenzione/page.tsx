import styles from "./page.module.css";

export default function MaintenancePage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.logo}>AM</div>
        <h1>Sito in manutenzione</h1>
        <p>Stiamo perfezionando la tua esperienza sonora. Torniamo tra pochissimo con grandi novità.</p>
        <div className={styles.line}></div>
        <p className={styles.small}>Sei un amministratore? Accedi dall'area riservata.</p>
      </div>
    </main>
  );
}
