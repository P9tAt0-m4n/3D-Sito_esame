// ===== Foglio Google pubblicato in formato CSV (tab della Home) =====
const URL_FOGLIO =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOTepoy8TlXF4SGrug2IsFZp0cqAs1azldEJpm-3bSRLuD0BbIWYqCjkjco-xdJYNH2VTCdchOS7lr/pub?gid=0&single=true&output=csv";

// Cartella delle immagini (stessa scrittura del nome della cartella)
const CARTELLA_IMG = "Img/";

// Prende il testo di una cella e toglie gli spazi in più
function pulisci(valore) {
  return (valore || "").trim();
}

// Mostra la presentazione (nome, qualifica, testo, foto)
function mostraPresentazione(riga) {
  document.getElementById("nome").textContent = pulisci(riga.titolo);
  document.getElementById("qualifica").textContent = pulisci(riga.sottotitolo);
  document.getElementById("presentazione").textContent = pulisci(riga.testo);

  // La foto si mostra solo se la cella non è vuota
  const nomeFoto = pulisci(riga.immagine);
  if (nomeFoto !== "") {
    const foto = document.getElementById("foto");
    foto.src = CARTELLA_IMG + nomeFoto;
    foto.alt = pulisci(riga.titolo);
    foto.hidden = false;
  }
}

// Crea una card per una passione
function creaCardPassione(riga) {
  const card = document.createElement("article");
  card.className = "card";

  // Immagine solo se presente
  const nomeImg = pulisci(riga.immagine);
  if (nomeImg !== "") {
    const img = document.createElement("img");
    img.className = "card-img";
    img.src = CARTELLA_IMG + nomeImg;
    img.alt = pulisci(riga.titolo);
    card.appendChild(img);
  }

  // Titolo
  const titolo = document.createElement("h3");
  titolo.className = "card-titolo";
  titolo.textContent = pulisci(riga.titolo);
  card.appendChild(titolo);

  // Descrizione solo se presente
  const descrizione = pulisci(riga.testo);
  if (descrizione !== "") {
    const testo = document.createElement("p");
    testo.className = "card-testo";
    testo.textContent = descrizione;
    card.appendChild(testo);
  }

  return card;
}

// Crea una barra per una competenza (livello da 0 a 100)
function creaCompetenza(riga) {
  const livello = Number(pulisci(riga.livello)) || 0;

  const blocco = document.createElement("div");
  blocco.className = "competenza";

  // Nome e percentuale
  const nome = document.createElement("p");
  nome.className = "competenza-nome";
  nome.textContent = pulisci(riga.titolo) + " - " + livello + "%";
  blocco.appendChild(nome);

  // Barra grigia con dentro la barra colorata
  const barra = document.createElement("div");
  barra.className = "barra";
  const riempimento = document.createElement("div");
  riempimento.className = "barra-livello";
  riempimento.style.width = livello + "%";
  barra.appendChild(riempimento);
  blocco.appendChild(barra);

  return blocco;
}

// Legge il foglio e riempie la pagina
Papa.parse(URL_FOGLIO, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function (risultato) {
    const passioni = document.getElementById("passioni");
    const competenze = document.getElementById("competenze");

    risultato.data.forEach(function (riga) {
      const sezione = pulisci(riga.sezione);

      if (sezione === "presentazione") {
        mostraPresentazione(riga);
      } else if (sezione === "passione") {
        passioni.appendChild(creaCardPassione(riga));
      } else if (sezione === "competenza") {
        competenze.appendChild(creaCompetenza(riga));
      }
    });
  },
  error: function () {
    document.getElementById("nome").textContent =
      "Non riesco a leggere il foglio.";
  }
});
