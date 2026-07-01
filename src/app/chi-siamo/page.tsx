import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container">
        <section className={styles.aboutHero}>
          <div className={styles.heroContent}>
            <div className={styles.tag}>La nostra storia</div>
            <h1>Dove il legno incontra l'acustica.</h1>
            <p>Acoustic May nasce a Squinzano, nel cuore del Salento, dalla passione per il suono puro e la maestria artigianale pugliese.</p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.imageGrid}>
            <div className={styles.mainImg}>
              {/* Image from Radice production could go here */}
            </div>
            <div className={styles.sideImgs}>
              <div className={styles.sideImg}></div>
              <div className={styles.sideImg}></div>
            </div>
          </div>
          
          <div className={styles.textBlock}>
            <h2>Artigianato 100% Salentino</h2>
            <p>Acoustic May è una realtà artigianale di Squinzano (LE) che fonde la tradizione del legno con l'innovazione acustica. Il nostro valore distintivo è la <strong>produzione 100% interna</strong>: dal taglio del legno (multistrato di betulla, pioppo, MDF) all'assemblaggio dei componenti, fino al collaudo acustico finale.</p>
            
            <div className={styles.storyHighlight}>
              <h3>Il Progetto Radice</h3>
              <p>Nato dal cuore del nostro territorio, il progetto Radice è la nostra risposta alla Xylella che ha colpito gli ulivi del Salento. Recuperiamo le radici degli alberi estirpati per trasformarle in diffusori Hi-Fi unici, dando nuova vita a un legno che racchiude secoli di storia.</p>
            </div>

            <p>Non costruiamo solo diffusori; creiamo pezzi unici che raccontano il territorio attraverso il suono. Ogni prodotto è testato man mano per garantire una qualità che il mondo industriale non potrà mai replicare.</p>
          </div>
        </section>

        <section className={styles.valuesSection}>
          <div className={styles.value}>
            <div className={styles.n}>01</div>
            <h3>Precisione Tecnica</h3>
            <p>Non siamo solo falegnami. Ogni cabinet è studiato per eliminare risonanze indesiderate e massimizzare le prestazioni degli altoparlanti.</p>
          </div>
          <div className={styles.value}>
            <div className={styles.n}>02</div>
            <h3>Personalizzazione</h3>
            <p>Crediamo che ogni ambiente meriti un suono specifico. Offriamo finiture su misura per integrare i nostri diffusori nel tuo spazio.</p>
          </div>
          <div className={styles.value}>
            <div className={styles.n}>03</div>
            <h3>Passione Reale</h3>
            <p>Costruiamo ogni pezzo come se dovesse suonare in casa nostra. La musica è emozione, e noi vogliamo onorarla.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
