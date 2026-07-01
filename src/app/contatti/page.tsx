import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className={styles.contactPage}>
        <div className="container">
          <div className={styles.grid}>
            {/* Info Column */}
            <div>
              <h1 className={styles.title}>Parliamo del tuo <br /><span className={styles.copperText}>prossimo ascolto.</span></h1>
              <p className={styles.subtitle}>
                Che tu stia cercando una coppia di monitor per il tuo studio o un impianto outdoor 
                per il tuo giardino, siamo pronti a consigliarti la soluzione migliore.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.iconBox}>📍</div>
                  <div>
                    <h3 className={styles.infoTitle}>Laboratorio</h3>
                    <p className={styles.infoDesc}>Via dei Muratori SN, 73018 Squinzano (LE)</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.iconBox}>📞</div>
                  <div>
                    <h3 className={styles.infoTitle}>Telefono</h3>
                    <p className={styles.infoDesc}>+39 351 576 4771 (Nicola)</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.iconBox}>✉️</div>
                  <div>
                    <h3 className={styles.infoTitle}>Email</h3>
                    <p className={styles.infoDesc}>info@acousticmay.it</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className={styles.hoursBox}>
                <h4 className={styles.hoursTitle}>
                   <span className={styles.statusDot}></span>
                   Siamo aperti
                </h4>
                <div className={styles.hoursGrid}>
                   <div>Lunedì — Venerdì</div>
                   <div style={{ textAlign: 'right' }}>09:00 - 18:00</div>
                   <div>Sabato</div>
                   <div style={{ textAlign: 'right' }}>Su appuntamento</div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <ContactForm />
          </div>
          
          {/* Map Section */}
          <div className={styles.mapSection}>
            <div className={styles.mapHeader}>
              <h2 className={styles.mapTitle}>Come Raggiungerci</h2>
              <div className={styles.mapLine}></div>
            </div>
            <div className={styles.mapBox}>
              <iframe 
                src="https://maps.google.com/maps?q=40.439733,18.054636&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%" 
                className={styles.mapIframe}
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
