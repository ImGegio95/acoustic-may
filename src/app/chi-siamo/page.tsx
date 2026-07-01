import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.aboutHero}>
          <div className={styles.heroContent}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Il suono nasce <br />
              <span className="text-copper">dalle mani.</span>
            </h1>
            <p className="text-xl text-stone-dark leading-relaxed mb-12">
              Acoustic May produce diffusori acustici artigianali a Squinzano (LE). 
              Il nostro valore distintivo è la produzione 100% interna — dal legno al collaudo acustico — 
              e la possibilità di personalizzare forme e finiture su richiesta.
            </p>
          </div>
        </section>

        {/* Heritage Story - The "Radice" Connection */}
        <section className={styles.heritageSection}>
          <div className={styles.container}>
            <div className={styles.grid2}>
              <div>
                <h2 className="text-3xl font-bold mb-6">Le nostre Radici</h2>
                <div className="space-y-4 text-stone-dark leading-relaxed">
                  <p>
                    Quando fai un viaggio nel <strong>Salento</strong>, ma al posto delle folte campagne di alberi di ulivo 
                    trovi semplicemente delle distese di terra desolate, ti piange il cuore.
                  </p>
                  <p>
                    Purtroppo, da qualche anno la <strong>Xylella</strong> ha colpito la maggior parte delle coltivazioni 
                    portate avanti negli anni da tantissimi agricoltori. Questo ha portato ad un inevitabile decadimento 
                    delle colture ed ha dato vita ad uno scenario di alberi ormai secchi.
                  </p>
                  <p>
                    Nella maggior parte dei casi, gli agricoltori hanno preferito tirare via i vecchi alberi 
                    <strong> estirpandone la radice</strong> per poter piantare nuove colture. Da questa resilienza 
                    e dal legame profondo con il territorio nasce la nostra ispirazione.
                  </p>
                </div>
              </div>
              <div className={styles.imagePlaceholder}>
                 <img 
                   src="/products/radice-hero.webp" 
                   alt="Radice Heritage" 
                   className="object-cover w-full h-full"
                 />
                 <div className={styles.overlayText}>
                   [Immagine Artigianato Salentino]
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Pillars */}
        <section className={styles.pillarsSection}>
          <div className={styles.pillar}>
            <div className="text-copper font-mono text-sm mb-4">01 / ARTIGIANALITÀ</div>
            <h3 className="text-xl font-bold mb-4">Realizzati a mano</h3>
            <p className="text-stone-dark leading-relaxed">
              Ogni cabinet è progettato e assemblato internamente, con la cura di chi conosce ogni vite del proprio prodotto.
            </p>
          </div>
          <div className={styles.pillar}>
            <div className="text-copper font-mono text-sm mb-4">02 / MATERIALI</div>
            <h3 className="text-xl font-bold mb-4">Legno Premium</h3>
            <p className="text-stone-dark leading-relaxed">
              Multistrato di betulla, pioppo e MDF selezionati: la qualità si sente prima ancora di accendere l'impianto.
            </p>
          </div>
          <div className={styles.pillar}>
            <div className="text-copper font-mono text-sm mb-4">03 / COMPETENZA</div>
            <h3 className="text-xl font-bold mb-4">Collaudo Reale</h3>
            <p className="text-stone-dark leading-relaxed">
              Ogni diffusore viene testato individualmente per garantire una risposta in frequenza lineare e un sound perfetto.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2 className="text-3xl font-bold mb-6">Vuoi saperne di più?</h2>
          <p className="text-stone-dark mb-10 max-w-2xl mx-auto">
            Siamo a tua disposizione per spiegarti il nostro processo costruttivo o per progettare insieme i tuoi nuovi diffusori.
          </p>
          <a href="/contatti" className="btn-dark">
            Contattaci
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
