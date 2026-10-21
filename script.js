// ===== UNICA RIGA DA MODIFICARE =====
const ID_FOGLIO = "1vdUfkxYPdjIaX9XExCHPPzXzkdFmA0zZhJX2YEG_SFw";

const catalogo = document.getElementById("catalogo");
const MESSAGGIO_ERRORE =
  "Non riesco a leggere il foglio. Controlla che l'ID sia giusto e che il foglio sia condiviso con 'Chiunque abbia il link'.";

// Mostra un messaggio al posto delle card
function mostraMessaggio(testo) {
  catalogo.textContent = testo;
}

// Crea una card per una riga del foglio
function creaCard(riga) {
  const nome = (riga.nome || "").trim();
  const descrizione = (riga.descrizione || "").trim();
  const immagine = (riga.immagine || "").trim();
  const categoria = (riga.categoria || "").trim();
  const link = (riga.link || "").trim();

  const card = document.createElement("article");
  card.className = "card";

  // Immagine: img se c'è un indirizzo http, altrimenti div grigio
  if (immagine.startsWith("http")) {
    const img = document.createElement("img");
    img.className = "card-img";
    img.src = immagine;
    img.alt = nome;
    card.appendChild(img);
  } else {
    const vuoto = document.createElement("div");
    vuoto.className = "card-img";
    card.appendChild(vuoto);
  }

  // Titolo
  const titolo = document.createElement("h2");
  titolo.className = "card-titolo";
  titolo.textContent = nome;
  card.appendChild(titolo);

  // Categoria (solo se presente)
  if (categoria !== "") {
    const etichetta = document.createElement("span");
    etichetta.className = "card-categoria";
    etichetta.textContent = categoria;
    card.appendChild(etichetta);
  }

  // Descrizione
  const testo = document.createElement("p");
  testo.className = "card-testo";
  testo.textContent = descrizione;
  card.appendChild(testo);

  // Bottone "Apri" (solo se il link inizia con http)
  if (link.startsWith("http")) {
    const bottone = document.createElement("a");
    bottone.className = "card-link";
    bottone.href = link;
    bottone.target = "_blank";
    bottone.rel = "noopener"; // sicurezza per i link esterni
    bottone.textContent = "Apri";
    card.appendChild(bottone);
  }

  return card;
}

// Legge il foglio e crea le card
function caricaCatalogo() {
  // Controllo: l'ID è vuoto o ancora quello di esempio?
  if (ID_FOGLIO === "" || ID_FOGLIO.startsWith("INCOLLA")) {
    mostraMessaggio(MESSAGGIO_ERRORE);
    return;
  }

  const url =
    "https://docs.google.com/spreadsheets/d/" +
    ID_FOGLIO +
    "/gviz/tq?tqx=out:csv&headers=1";

  Papa.parse(url, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (risultato) {
      // Se manca la colonna "nome" il foglio non è stato letto bene
      const colonne = risultato.meta.fields || [];
      if (!colonne.includes("nome") || risultato.data.length === 0) {
        mostraMessaggio(MESSAGGIO_ERRORE);
        return;
      }

      catalogo.textContent = ""; // toglie "Sto caricando gli oggetti..."
      risultato.data.forEach(function (riga) {
        catalogo.appendChild(creaCard(riga));
      });
    },
    error: function () {
      mostraMessaggio(MESSAGGIO_ERRORE);
    }
  });
}

caricaCatalogo();