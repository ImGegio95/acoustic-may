# Acoustic May — Redesign E-commerce
### Documento strategico UX/UI · Design System · Razionale CRO

---

## 1. Moodboard e direzione creativa

**Brief sintetico del brand (estratto dal sito attuale):** Acoustic May produce diffusori acustici artigianali a Squinzano (LE), con linee Studio Monitor, Garden Audio e Home Hi-Fi (Radice, OUD) e una linea Accessori. Il valore distintivo dichiarato dall'azienda è la produzione 100% interna — dal legno (multistrato di betulla, pioppo, MDF) al collaudo acustico — e la possibilità di personalizzare forme e finiture su richiesta del cliente.

**Palette**
| Ruolo | Colore | Hex |
|---|---|---|
| Primario scuro | Ink (nero caldo) | `#14130F` |
| Primario chiaro | Paper (bianco carta) | `#FAF8F4` |
| Superficie secondaria | Paper 2 | `#F1EDE5` |
| Neutro | Stone | `#A39B8B` |
| Neutro scuro | Stone Dark | `#6F6759` |
| Superficie scura | Anthracite | `#26241F` |
| **Accento** | **Copper (rame bruciato)** | `#BD5B2C` |
| Accento scuro (hover) | Copper Dark | `#9C4720` |
| Tint accento | Copper Tint | `#F1DCC9` |

*Perché il rame:* richiama il rame delle bobine mobili degli altoparlanti e il legno lavorato — un accento che racconta il prodotto invece di essere un colore arbitrario, mantenendo comunque la base nero/bianco/grigio richiesta.

**Tipografia**
- **Space Grotesk** — titoli e display: geometrica, tecnica, leggibile a grandi dimensioni, coerente con un brand che unisce artigianato e precisione costruttiva.
- **Inter** — testo corrente: massima leggibilità su ogni dispositivo.
- **JetBrains Mono** — prezzi, specifiche tecniche, codici prodotto: rafforza la percezione "scheda tecnica da laboratorio acustico", distingue visivamente i dati numerici dal contenuto editoriale.

**Elemento firma:** una sottile linea a forma d'onda sonora, usata come divisore tra sezioni e come dettaglio nei badge "novità" — l'unico elemento decorativo ricorrente, per restare riconoscibili senza appesantire il layout.

**Benchmark grafico (riferimenti, non copiati):**
- *Bowers & Wilkins / Bang & Olufsen* → fotografia prodotto isolata su sfondo materico, gerarchia tipografica forte nei titoli prodotto.
- *Sonos* → card prodotto pulite, micro-interazioni hover misurate, niente badge urlati.
- *Dyson* → uso dello spazio bianco come strumento di percezione "premium", sezioni "perché sceglierci" basate su fatti tecnici e non su slogan.
- *Apple* → un solo CTA primario per schermata, gerarchia visiva mai ambigua, footer denso ma ordinato.

---

## 2. Architettura dell'informazione e Sitemap

```
Home
├── Studio Monitor (categoria)
│   └── Prodotto (es. Bontone 6C)
├── Garden Audio (categoria)
│   └── Prodotto
├── Home Hi-Fi (categoria)
│   ├── Radice (sotto-linea)
│   └── OUD (sotto-linea)
├── Accessori (categoria)
│   └── Prodotto
├── Chi siamo
│   ├── La nostra storia
│   ├── Il processo artigianale
│   └── Team
├── Blog / Guide
│   └── Articolo
├── Assistenza
│   ├── FAQ
│   ├── Manuali e download
│   └── Richiesta assistenza
├── Contatti
├── Carrello
├── Checkout (1 step, ospite o account)
└── Area Cliente
    ├── Ordini
    ├── Fatture
    ├── Preferiti
    ├── Indirizzi
    └── Profilo
```

**Perché questa struttura (UX):** mantiene tutte le 4 famiglie prodotto a un solo click dalla home (mega menu), e ogni prodotto è raggiungibile in **massimo 3 click**: Home → Categoria → Prodotto. La sottolinea Radice/OUD resta visibile nel mega menu invece che nascosta in un sottomenu profondo, perché sono nomi che il cliente esistente già riconosce.

---

## 3. User Flow — Percorso d'acquisto principale

```
[Home / Landing categoria]
        │  CTA "Scopri la collezione" o click su categoria
        ▼
[Catalogo] ── filtro per categoria / prezzo / finitura ── ricerca
        │  click su card prodotto
        ▼
[Pagina Prodotto] ── consulta specifiche / recensioni / FAQ
        │
        ├── dubbio tecnico → "Richiedi informazioni" (form rapido, non lascia la pagina)
        │
        ▼  sceglie finitura + quantità
[Aggiungi al carrello] ── mini-cart si apre lateralmente (no redirect forzato)
        │
        ├── continua lo shopping (mini-cart resta accessibile)
        │
        ▼
[Carrello] ── riepilogo, coupon, stima spedizione
        ▼
[Checkout — flusso unico]
   Step unico: dati spedizione → metodo spedizione → pagamento → conferma
   (guest checkout sempre disponibile, account opzionale dopo l'acquisto)
        ▼
[Conferma ordine] → email + accesso Area Cliente
```

**Razionale CRO:**
- **Mini-cart laterale invece di redirect al carrello**: riduce l'abbandono perché non interrompe la navigazione — chi sta confrontando prodotti continua a farlo.
- **Guest checkout di default**: l'obbligo di creare un account prima di acquistare è una delle cause più comuni di abbandono carrello nell'e-commerce B2C; l'account viene proposto *dopo* la conferma, quando il valore (tracciare l'ordine) è già evidente.
- **"Richiedi informazioni" sempre visibile sulla scheda prodotto**: per un acquisto da 150-500€ una parte del pubblico ha bisogno di rassicurazione prima di pagare; intercettare il dubbio sulla pagina prodotto evita che l'utente esca a cercare risposte altrove (e non torni più).
- **Checkout a step unico**: ogni passaggio aggiuntivo nel funnel di pagamento è un punto di abbandono misurabile; consolidare riduce il numero di "porte d'uscita".

---

## 4. Wireframe — Low Fidelity (struttura, prima del visual)

**Home (sequenza a blocchi):**
```
[Header: logo | nav | ricerca | account | carrello]
[Hero full-bleed: claim + CTA]
[3 value props orizzontali]
[Griglia categorie: 5 card asimmetriche]
[Carosello "novità"]
[Carosello "best seller"]
[Banda scura "perché Acoustic May": 4 colonne]
[Carosello recensioni]
[Striscia loghi brand/componenti]
[CTA finale full-width]
[Footer: 5 colonne + newsletter + legal]
```

**Pagina Prodotto:**
```
[Breadcrumb]
[Colonna sinistra: gallery + thumbnail]   [Colonna destra: nome, prezzo, stock,
                                            varianti, CTA acquista, CTA richiedi info,
                                            accordion specifiche/spedizione/FAQ]
[Riga: accessori consigliati]
[Riga: prodotti correlati]
```

Questa scomposizione a blocchi è stata validata prima di passare alla fase High Fidelity, per garantire che la gerarchia dei contenuti (cosa l'utente vede per primo, secondo, terzo) sia corretta indipendentemente dallo stile visivo.

**Wireframe High Fidelity e Mockup definitivo:** sviluppati direttamente nel prototipo interattivo allegato (vedi sezione 6), che integra entrambi i livelli — è navigabile e mostra già la resa tipografica, cromatica e spaziale finale.

---

## 5. Design System

### Spaziatura e griglia
- Griglia desktop: container max-width 1440px, gutter 24px, margini laterali 40px.
- Scala spaziature: 8 · 14 · 16 · 20 · 24 · 32 · 44 · 56 · 88px — usata in modo coerente per padding di sezione (88px desktop / 56px mobile) e tra elementi.
- Border radius: 6-8px su input e bottoni piccoli, 10px su card, 14-18px su blocchi grandi (CTA finale, gallery prodotto) — "leggermente arrotondato" come richiesto, mai pillole esagerate eccetto i bottoni stessi (100px, stile pill, per i CTA principali).
- Ombre: una sola scala — `shadow` leggera per hover di card, `shadow-lg` per elementi in primo piano (CTA finale, prototipo desktop frame).

### Componenti chiave (tutti presenti nel prototipo, tab "Componenti")
Header sticky · Mega menu · Footer 5 colonne · Card prodotto con hover (wishlist + CTA che emergono) · Bottoni (primario / ghost / scuro / outline / disabilitato) · Campi input con stato focus visibile · Badge (novità / sconto / esaurito) · Breadcrumb · Accordion (specifiche, FAQ) · Tabs (pagine catalogo) · Filtri prodotto (sidebar desktop, chip orizzontali mobile) · Mini-cart · Toast di successo/errore · Skeleton loading.

### Stati interattivi
- **Hover**: card prodotto si solleva (translateY -2px) + ombra + comparsa pulsante "Aggiungi al carrello" e icona wishlist.
- **Focus**: outline 2px colore accento, sempre visibile (accessibilità tastiera).
- **Active**: bottoni passano a `copper-dark`/nero pieno.
- **Disabled**: sfondo `paper2`, testo `stone`, niente ombra né hover.

---

## 6. Mockup interattivo

Il file `acousticmay-mockup.html` (allegato) è un **prototipo navigabile**, non un'immagine statica:
- Tab in alto per passare tra **Home / Catalogo / Prodotto / Componenti**.
- Toggle **Desktop / Mobile** che ridimensiona la vista in tempo reale (mobile-first: ogni sezione è stata progettata prima per 390px e poi estesa).
- Interazioni reali: hover sulle card prodotto, accordion apri/chiudi sulla scheda prodotto, filtri visivi nel catalogo.

**Micro-animazioni e transizioni previste in produzione** (descritte, da implementare in CSS/JS reale):
- Header: passa da trasparente a sfondo sfocato (`backdrop-filter`) dopo 10px di scroll.
- Hero: dissolvenza + leggero parallasse dell'anello decorativo allo scroll.
- Card prodotto: transizione 0.25s su elevazione e comparsa CTA.
- Mega menu: apertura con fade + slide di 8px, chiusura automatica al click fuori area.
- Filtri catalogo: aggiornamento griglia con fade-out/fade-in dei risultati (no reload pagina).
- Mini-cart: slide-in da destra, overlay scuro semi-trasparente sul resto della pagina.
- Checkout: barra di progressione minimale in alto, transizione orizzontale tra i campi dello step unico.
- Skeleton loading su immagini prodotto durante il caricamento iniziale del catalogo.

---

## 7. Motivazioni di design (UX · UI · CRO) — sintesi delle scelte principali

| Scelta | Motivazione UX | Motivazione CRO |
|---|---|---|
| Hero full-bleed con un solo CTA primario | Riduce il carico decisionale al primo impatto | Un solo percorso d'azione aumenta il tasso di click rispetto a CTA multipli di pari peso |
| Mega menu con sotto-linee visibili (Radice/OUD) | Evita di nascondere prodotti noti ai clienti esistenti | Riduce il tempo per raggiungere un prodotto specifico, meno abbandono in fase di ricerca |
| Card prodotto con CTA che appare in hover | Mantiene la griglia pulita finché l'utente non mostra intenzione | L'azione compare proprio nel momento di massimo interesse (hover = attenzione attiva) |
| Badge minimali (testo, no colori accesi) | Coerente con posizionamento premium | I badge urlati abbassano la percezione di qualità in prodotti di fascia medio-alta |
| "Richiedi informazioni" su ogni scheda prodotto | Risponde al bisogno di rassicurazione su un acquisto artigianale/su misura | Intercetta il dubbio prima che l'utente abbandoni il sito per cercare altrove |
| Checkout a step unico, guest di default | Percorso più breve possibile | Ogni step extra è un punto di abbandono misurabile nel funnel |
| Sezione "Perché Acoustic May" basata su fatti (100% Made in Italy, collaudo individuale, su misura) | Comunica autorevolezza senza slogan vuoti | Argomenti concreti riducono l'attrito decisionale su acquisti non d'impulso (150-500€) |
| Font monospace per prezzi/specifiche | Differenzia visivamente dato numerico da contenuto editoriale | Il prezzo è immediatamente scansionabile, riduce il tempo di lettura della card |

---

## 8. Prossimi passi suggeriti

1. Validare il prototipo con 4-5 utenti reali (test di usabilità su task: "trova un diffusore da giardino sotto i 300€").
2. Estendere il mockup alle pagine non ancora dettagliate nel prototipo (Chi siamo, Contatti, Blog, Carrello, Checkout, Area Cliente) seguendo lo stesso design system.
3. Convertire questo documento in PDF/Word per la condivisione con il team o gli stakeholder, se utile.
4. Passaggio a sviluppo: i token CSS del prototipo (`acousticmay-mockup.html`) sono già pronti per essere portati in un design system Figma o direttamente in produzione.

---

*Documento preparato come base di discussione: ogni scelta cromatica, tipografica e strutturale è motivata sopra ed è modificabile in base al feedback del team Acoustic May.*
