// ===== Foglio Google pubblicato in formato CSV (tab Extra) =====
// L'ID del foglio è lo stesso della Home: cambia solo il numero dopo gid=
// (sostituisci NUMERO_GID_EXTRA con il gid del tab "Extra")
const URL_FOGLIO =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOTepoy8TlXF4SGrug2IsFZp0cqAs1azldEJpm-3bSRLuD0BbIWYqCjkjco-xdJYNH2VTCdchOS7lr/pub?gid=934019826&single=true&output=csv";

// Cartella delle immagini (come nella Home)
const CARTELLA_IMG = "Img/";

// Prende il testo di una cella e toglie gli spazi in più
function pulisci(valore) {
  return (valore || "").trim();
}

// Mostra titolo grande e introduzione (riga "pagina")
function mostraPagina(riga) {
  const titolo = pulisci(riga.titolo);
  if (titolo !== "") {
    const h1 = document.getElementById("titolo-pagina");
    h1.textContent = titolo;
    h1.hidden = false;
  }

  const descrizione = pulisci(riga.descrizione);
  if (descrizione !== "") {
    const intro = document.getElementById("intro-pagina");
    intro.textContent = descrizione;
    intro.hidden = false;
  }
}

// Crea una card per una riga "scheda"
function creaCardExtra(riga) {
  const card = document.createElement("article");
  card.className = "card card-extra";

  // Immagine solo se la cella non è vuota
  const nomeImg = pulisci(riga.immagine);
  if (nomeImg !== "") {
    const img = document.createElement("img");
    img.className = "card-img";
    img.src = CARTELLA_IMG + nomeImg;
    img.alt = pulisci(riga.titolo);
    card.appendChild(img);
  }

  // Categoria come piccola etichetta
  const categoria = pulisci(riga.categoria);
  if (categoria !== "") {
    const etichetta = document.createElement("span");
    etichetta.className = "card-categoria";
    etichetta.textContent = categoria;
    card.appendChild(etichetta);
  }

  // Titolo
  const titolo = pulisci(riga.titolo);
  if (titolo !== "") {
    const h3 = document.createElement("h3");
    h3.className = "card-titolo";
    h3.textContent = titolo;
    card.appendChild(h3);
  }

  // Descrizione
  const descrizione = pulisci(riga.descrizione);
  if (descrizione !== "") {
    const testo = document.createElement("p");
    testo.className = "card-testo";
    testo.textContent = descrizione;
    card.appendChild(testo);
  }

  // Pulsante "Apri": solo se il link inizia con http:// o https://
  const link = pulisci(riga.link);
  if (link.startsWith("https://") || link.startsWith("http://")) {
    const pulsante = document.createElement("a");
    pulsante.className = "pulsante";
    pulsante.textContent = "Apri";
    pulsante.href = link;
    pulsante.target = "_blank"; // si apre in una nuova scheda
    pulsante.rel = "noopener noreferrer";
    card.appendChild(pulsante);
  }

  return card;
}

// Legge il foglio e riempie la pagina
Papa.parse(URL_FOGLIO, {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: function (risultato) {
    const lista = document.getElementById("extra-lista");

    risultato.data.forEach(function (riga) {
      const sezione = pulisci(riga.sezione);

      if (sezione === "pagina") {
        mostraPagina(riga);
      } else if (sezione === "scheda") {
        lista.appendChild(creaCardExtra(riga));
      }
    });
  },
  error: function () {
    const h1 = document.getElementById("titolo-pagina");
    h1.textContent = "Non riesco a leggere il foglio.";
    h1.hidden = false;
  }
});
