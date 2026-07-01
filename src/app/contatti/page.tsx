import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-24 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24">
            {/* Info Column */}
            <div>
              <h1 className="text-5xl font-bold mb-8">Parliamo del tuo <br /><span className="text-copper">prossimo ascolto.</span></h1>
              <p className="text-xl text-stone-dark mb-12 leading-relaxed">
                Che tu stia cercando una coppia di monitor per il tuo studio o un impianto outdoor 
                per il tuo giardino, siamo pronti a consigliarti la soluzione migliore.
              </p>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-paper2 rounded-full flex items-center justify-center flex-shrink-0 text-xl">📍</div>
                  <div>
                    <h3 className="font-bold mb-1">Laboratorio</h3>
                    <p className="text-stone-dark text-sm">Via dei Muratori SN, 73018 Squinzano (LE)</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-paper2 rounded-full flex items-center justify-center flex-shrink-0 text-xl">📞</div>
                  <div>
                    <h3 className="font-bold mb-1">Telefono</h3>
                    <p className="text-stone-dark text-sm">+39 351 576 4771 (Nicola)</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-paper2 rounded-full flex items-center justify-center flex-shrink-0 text-xl">✉️</div>
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-stone-dark text-sm">info@acousticmay.it</p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-16 p-8 bg-paper2 rounded-2xl border border-line">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                   <span className="w-2 h-2 bg-copper rounded-full"></span>
                   Siamo aperti
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-stone-dark">
                   <div>Lunedì — Venerdì</div>
                   <div className="text-right">09:00 - 18:00</div>
                   <div>Sabato</div>
                   <div className="text-right">Su appuntamento</div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-line h-fit">
              <h2 className="text-2xl font-bold mb-8">Inviaci un messaggio</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-dark">Nome</label>
                    <input type="text" className="w-full p-4 bg-paper2 border-transparent focus:border-copper focus:ring-0 rounded-xl transition-all outline-none" placeholder="Il tuo nome" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-dark">Email</label>
                    <input type="email" className="w-full p-4 bg-paper2 border-transparent focus:border-copper focus:ring-0 rounded-xl transition-all outline-none" placeholder="la-tua@email.it" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-dark">Oggetto</label>
                  <select className="w-full p-4 bg-paper2 border-transparent focus:border-copper focus:ring-0 rounded-xl transition-all outline-none appearance-none">
                    <option>Informazioni prodotti</option>
                    <option>Progetto su misura</option>
                    <option>Assistenza tecnica</option>
                    <option>Altro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-dark">Messaggio</label>
                  <textarea rows={4} className="w-full p-4 bg-paper2 border-transparent focus:border-copper focus:ring-0 rounded-xl transition-all outline-none resize-none" placeholder="Come possiamo aiutarti?"></textarea>
                </div>
                <button type="button" className="w-full py-5 bg-ink text-paper rounded-full font-bold hover:bg-black transition-all transform hover:-translate-y-1">
                  Invia Messaggio
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
