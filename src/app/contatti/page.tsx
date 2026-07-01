import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="container">
        <section className={styles.contactHero}>
          <h1>Siamo qui per ascoltarti.</h1>
          <p>Che tu sia un professionista o un appassionato, contattaci per parlare del tuo prossimo impianto acustico.</p>
        </section>

        <section className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><Mail size={24} strokeWidth={1.5} /></div>
              <div>
                <h4>Email</h4>
                <p>info@acousticmay.it</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><Phone size={24} strokeWidth={1.5} /></div>
              <div>
                <h4>Telefono</h4>
                <p>+39 351 576 4771 (Nicola)</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}><MapPin size={24} strokeWidth={1.5} /></div>
              <div>
                <h4>Sede Laboratorio</h4>
                <p>Via dei Muratori SN, 73018 Squinzano (LE)</p>
              </div>
            </div>
          </div>

          <form className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label>Nome</label>
                <input type="text" placeholder="Il tuo nome" />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" placeholder="nome@esempio.it" />
              </div>
            </div>
            <div className={styles.field}>
              <label>Oggetto</label>
              <select>
                <option>Richiesta informazioni</option>
                <option>Preventivo su misura</option>
                <option>Assistenza tecnica</option>
                <option>Altro</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Messaggio</label>
              <textarea placeholder="Come possiamo aiutarti?" rows={6}></textarea>
            </div>
            <button type="submit" className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }}>
              Invia Messaggio
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
