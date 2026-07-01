import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-40 pb-24 bg-paper">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-paper2 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl">👤</div>
          <h1 className="text-4xl font-bold mb-6">Area Cliente</h1>
          <p className="text-xl text-stone-dark mb-12">
            Stiamo preparando la tua area personale per permetterti di gestire ordini, 
            preferiti e assistenza in un unico posto.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 bg-white rounded-2xl border border-line">
              <h3 className="font-bold mb-4">I tuoi ordini</h3>
              <p className="text-sm text-stone-dark mb-6">Visualizza lo stato delle tue spedizioni e lo storico acquisti.</p>
              <span className="text-xs font-bold text-stone tracking-widest uppercase">Disponibile a breve</span>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-line">
              <h3 className="font-bold mb-4">Assistenza Premium</h3>
              <p className="text-sm text-stone-dark mb-6">Apri un ticket o richiedi assistenza diretta per i tuoi prodotti.</p>
              <span className="text-xs font-bold text-stone tracking-widest uppercase">Disponibile a breve</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
