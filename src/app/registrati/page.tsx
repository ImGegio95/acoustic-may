import RegistrationForm from "./RegistrationForm";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="container" style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center' }}>
        <div className={styles.registerBox}>
          <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Crea un Account</h1>
          <p style={{ textAlign: 'center', color: 'var(--stone-d)', marginBottom: '32px' }}>
            Registrati per gestire i tuoi ordini e salvare i dati di fatturazione.
          </p>
          <RegistrationForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
