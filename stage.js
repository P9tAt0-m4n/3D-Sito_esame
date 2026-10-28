// ===== Foglio Google: leggo il tab chiamato "Stage" =====
const ID_FOGLIO = "1MAJD8MCsRLK6TxwnfN4JeH69zjD938KoM3-3CX_I7aA";
const URL_STAGE =
  "https://docs.google.com/spreadsheets/d/" +
  ID_FOGLIO +
  "/gviz/tq?tqx=out:csv&headers=1&sheet=Stage";

// Cartella delle immagini (stessa scrittura del nome della cartella)
const CARTELLA_IMG = "Img/";

const lista = document.getElementById("stage-lista");

// Toglie gli spazi in più da una cella
function pulisci(valore) {
  return (valore || "").trim();
}

// Crea un elemento con del testo, solo se il testo non è vuoto
function creaTesto(tag, classe, testo) {
  if (testo === "") {
    return null;
  }
  const el = document.createElement(tag);
  if (classe !== "") {
    el.className = classe;
  }
  el.textContent = testo;
  return el;
}

// Crea la card con immagine, azienda, luogo, settore e attività
function creaCard(riga) {
  const card = document.createElement("article");
  card.className = "stage-card";

  // Immagine solo se la cella non è vuota
  const nomeImg = pulisci(riga.immagine);
  if (nomeImg !== "") {
    const img = document.createElement("img");
    img.src = CARTELLA_IMG + nomeImg;
    img.alt = pulisci(riga.azienda);
    card.appendChild(img);
  }

  const testo = document.createElement("div");
  testo.className = "stage-card-testo";

  // Nome dell'azienda, luogo e settore (solo se presenti)
  const campi = [
    creaTesto("h2", "stage-azienda", pulisci(riga.azienda)),
    creaTesto("p", "stage-luogo", pulisci(riga.luogo)),
    creaTesto("p", "stage-settore", pulisci(riga.settore))
  ];
  campi.forEach(function (campo) {
    if (campo !== null) {
      testo.appendChild(campo);
    }
  });

  // Attività: i punti sono separati da ";"
  const punti = pulisci(riga.attivita)
    .split(";")
    .map(function (p) { return p.trim(); })
    .filter(function (p) { return p !== ""; });

  if (punti.length > 0) {
    const titoloElenco = document.createElement("h3");
    titoloElenco.textContent = "Di cosa si occupa";
    testo.appendChild(titoloElenco);

    const ul = document.createElement("ul");
    punti.forEach(function (punto) {
      const li = document.createElement("li");
      li.textContent = punto;
      ul.appendChild(li);
    });
    testo.appendChild(ul);
  }

  card.appendChild(testo);
  return card;
}

// Crea un blocco: card + relazione
function creaBlocco(riga) {
  const blocco = document.createElement("section");
  blocco.className = "stage-blocco";

  blocco.appendChild(creaCard(riga));

  // Relazione solo se c'è del testo
  const relazione = pulisci(riga.relazione);
  if (relazione !== "") {
    const titolo = document.createElement("h3");
    titolo.textContent = "Relazione";
    blocco.appendChild(titolo);

    const p = document.createElement("p");
    p.className = "stage-relazione"; // il CSS mantiene gli a capo
    p.textContent = relazione;
    blocco.appendChild(p);
  }

  return blocco;
}

// Legge il foglio e crea un blocco per ogni riga
Papa.parse(URL_STAGE, {
  download: true,
  header: true,
  skipEmptyLines: true,
  // Nomi delle colonne senza spazi e in minuscolo
  transformHeader: function (nome) {
    return nome.trim().toLowerCase();
  },
  complete: function (risultato) {
    risultato.data.forEach(function (riga) {
      lista.appendChild(creaBlocco(riga));
    });

    if (lista.children.length === 0) {
      lista.textContent = "Non trovo dati nel tab Stage del foglio.";
    }
  },
  error: function () {
    lista.textContent = "Non riesco a leggere il foglio.";
  }
});
