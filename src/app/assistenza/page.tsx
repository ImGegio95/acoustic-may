import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./page.module.css";

export default function SupportPage() {
  const faqs = [
    {
      q: "Quali sono i tempi di spedizione?",
      a: "Ogni prodotto Acoustic May è realizzato o collaudato a mano. Gli ordini vengono solitamente evasi entro 5 giorni lavorativi dal pagamento."
    },
    {
      q: "Posso personalizzare le finiture?",
      a: "Certamente. Essendo una produzione artigianale, possiamo personalizzare colori e materiali. Contattaci per un preventivo su misura."
    },
    {
      q: "I prodotti hanno una garanzia?",
      a: "Sì, tutti i nostri diffusori sono coperti dalla garanzia legale di 2 anni. Essendo riparabili internamente, offriamo assistenza diretta post-vendita."
    },
    {
      q: "Come posso pulire i diffusori in legno?",
      a: "Consigliamo l'uso di un panno morbido in microfibra leggermente umido. Evitare prodotti chimici aggressivi che potrebbero danneggiare le vernici artigianali."
    }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-16">
            <h1 className="text-5xl font-bold mb-6">Assistenza</h1>
            <p className="text-xl text-stone-dark max-w-2xl">
              Siamo qui per garantirti la migliore esperienza d'ascolto. 
              Trova risposte rapide o scarica i manuali tecnici dei tuoi prodotti.
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-16">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-8">Domande Frequenti</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-6 bg-paper border border-line rounded-xl">
                    <h3 className="font-bold mb-3">{faq.q}</h3>
                    <p className="text-stone-dark text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar: Manuals & Contacts */}
            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-bold mb-8">Manuali & Download</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-paper2 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-stone/10 transition-colors">
                    <div>
                      <div className="font-bold text-sm">Manuale Bontone 6c</div>
                      <div className="text-xs text-stone-dark">PDF · 2.4 MB</div>
                    </div>
                    <span className="text-copper group-hover:translate-y-1 transition-transform">↓</span>
                  </div>
                  <div className="p-4 bg-paper2 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-stone/10 transition-colors">
                    <div>
                      <div className="font-bold text-sm">Guida Installazione Garden</div>
                      <div className="text-xs text-stone-dark">PDF · 1.8 MB</div>
                    </div>
                    <span className="text-copper group-hover:translate-y-1 transition-transform">↓</span>
                  </div>
                </div>
              </section>

              <section className="p-8 bg-ink text-paper rounded-2xl">
                <h2 className="text-xl font-bold mb-4">Serve aiuto diretto?</h2>
                <p className="text-sm text-paper/60 mb-8 leading-relaxed">
                  Non hai trovato quello che cercavi? Parla direttamente con il nostro team tecnico.
                </p>
                <a href="/contatti" className="block w-full py-4 bg-copper text-center rounded-full font-bold hover:bg-copper-dark transition-colors">
                  Richiedi Supporto
                </a>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
