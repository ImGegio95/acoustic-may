import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import LoginForm from "@/components/LoginForm";

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className={styles.accountPage}>
        <div className={styles.heroBg}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
        </div>

        <div className={styles.container}>
          <div className={styles.loginCard}>
            <div className={styles.cardHeader}>
              <h1>Area Riservata</h1>
              <p>Accedi per gestire lo store Acoustic May</p>
            </div>

            <LoginForm />

            <div className={styles.divider}>
              <span>oppure</span>
            </div>

            <div className={styles.registerPrompt}>
              <p>Non hai ancora un account?</p>
              <button type="button" className="btn btn-ghost w-full">Crea un account artigiano</button>
            </div>
          </div>

          <div className={styles.benefits}>
            <h3>Perché registrarsi?</h3>
            <div className={styles.benefitList}>
              <div className={styles.benefitItem}>
                <div className={styles.icon}>📦</div>
                <div>
                  <h4>Traccia i tuoi ordini</h4>
                  <p>Segui ogni fase della creazione e spedizione del tuo diffusore.</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.icon}>🛠️</div>
                <div>
                  <h4>Assistenza Prioritaria</h4>
                  <p>Canale diretto con il laboratorio per manutenzione e consigli.</p>
                </div>
              </div>
              <div className={styles.benefitItem}>
                <div className={styles.icon}>✨</div>
                <div>
                  <h4>Anteprime Esclusive</h4>
                  <p>Accesso anticipato alle nuove serie limitate e prototipi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
