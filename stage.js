// Link CSV del foglio: stesso ID della Home, cambia solo gid (numero del tab "Stage")
const URL_STAGE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTOTepoy8TlXF4SGrug2IsFZp0cqAs1azldEJpm-3bSRLuD0BbIWYqCjkjco-xdJYNH2VTCdchOS7lr/pub?gid=211737495&single=true&output=csv";

const contenitore = document.getElementById("stage-lista");

// Toglie gli spazi; se la cella è vuota restituisce ""
function pulisci(valore) {
  return (valore || "").trim();
}

// Crea un elemento con il testo (textContent, mai innerHTML)
function creaElemento(tag, testo, classe) {
  const el = document.createElement(tag);
  el.textContent = testo;
  if (classe) el.className = classe;
  return el;
}

// Crea il blocco di un singolo stage (una riga del foglio)
function creaBlocco(riga) {
  const azienda = pulisci(riga.azienda);
  const luogo = pulisci(riga.luogo);
  const immagine = pulisci(riga.immagine);
  const settore = pulisci(riga.settore);
  const relazione = pulisci(riga.relazione);
  // Punti separati da ";" -> li divido, tolgo gli spazi e scarto quelli vuoti
  const attivita = pulisci(riga.attivita)
    .split(";")
    .map(function (p) { return p.trim(); })
    .filter(function (p) { return p !== ""; });

  const blocco = document.createElement("section");
  blocco.className = "stage-blocco";

  // --- Card ---
  const card = document.createElement("div");
  card.className = "stage-card";

  if (immagine) {
    const img = document.createElement("img");
    img.src = "img/" + immagine; // il file sta nella cartella img/
    img.alt = azienda;
    card.appendChild(img);
  }

  const corpo = document.createElement("div");
  corpo.className = "stage-card-testo";

  if (azienda) corpo.appendChild(creaElemento("h2", azienda));
  if (luogo) corpo.appendChild(creaElemento("p", "Luogo: " + luogo));
  if (settore) corpo.appendChild(creaElemento("p", "Settore: " + settore));

  // Elenco puntato delle attività
  if (attivita.length > 0) {
    corpo.appendChild(creaElemento("h3", "Di cosa si occupa"));
    const ul = document.createElement("ul");
    attivita.forEach(function (punto) {
      ul.appendChild(creaElemento("li", punto));
    });
    corpo.appendChild(ul);
  }

  card.appendChild(corpo);
  blocco.appendChild(card);

  // --- Relazione (a capo mantenuti con il CSS white-space: pre-line) ---
  if (relazione) {
    blocco.appendChild(creaElemento("h3", "Relazione"));
    blocco.appendChild(creaElemento("p", relazione, "stage-relazione"));
  }

  return blocco;
}

// Legge il foglio con PapaParse e crea un blocco per ogni riga
Papa.parse(URL_STAGE, {
  download: true,
  header: true,          // la prima riga contiene i nomi delle colonne
  skipEmptyLines: true,
  complete: function (risultato) {
    risultato.data.forEach(function (riga) {
      // salto le righe senza azienda
      if (pulisci(riga.azienda) === "") return;
      contenitore.appendChild(creaBlocco(riga));
    });
  },
  error: function () {
    contenitore.textContent = "Non riesco a leggere il foglio.";
  }
});
