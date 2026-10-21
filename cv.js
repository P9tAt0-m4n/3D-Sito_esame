// ===== Pagina CV: legge il tab "CV" del Google Foglio =====

// ATTENZIONE: metti qui lo STESSO link CSV che usa la tua Home (stesso ID del foglio).
// Cambia solo il gid, se il tab "CV" ne ha uno diverso da 0.
const URL_CV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPYUotiG_i-uxk1h3w7LfGx74eU7VSqE_dKvPfhTpdiFZ831EcsyyiHPRwUCK_GXjvhBp23wb0J7sx/pub?gid=0&single=true&output=csv";

// Crea un elemento con del testo (textContent, mai innerHTML) e lo aggiunge al padre
function aggiungi(padre, tag, classe, testo) {
  if (!testo || testo.trim() === "") return; // cella vuota: non la mostro
  const el = document.createElement(tag);
  el.className = classe;
  el.textContent = testo;
  padre.appendChild(el);
}

// Mostra una riga "dati": nome dell'informazione + valore
function mostraDato(riga, contenitore) {
  const voce = document.createElement("div");
  voce.className = "cv-dato";
  aggiungi(voce, "strong", "cv-nome", riga.titolo);
  aggiungi(voce, "span", "cv-valore", riga.testo);
  contenitore.appendChild(voce);
}

// Mostra una riga "istruzione" o "esperienza": titolo, sottotitolo, periodo, testo
function mostraVoce(riga, contenitore) {
  const voce = document.createElement("article");
  voce.className = "cv-voce";
  aggiungi(voce, "h3", "cv-titolo", riga.titolo);
  aggiungi(voce, "p", "cv-sottotitolo", riga.sottotitolo);
  aggiungi(voce, "p", "cv-periodo", riga.periodo);
  aggiungi(voce, "p", "cv-testo", riga.testo);
  contenitore.appendChild(voce);
}

// Scarico il foglio e riempio i tre blocchi
Papa.parse(URL_CV, {
  download: true,
  header: true,          // la prima riga contiene i nomi delle colonne
  skipEmptyLines: true,
  complete: function (risultato) {
    risultato.data.forEach(function (riga) {
      // Leggo la colonna "sezione" (tolgo spazi e maiuscole)
      const sezione = (riga.sezione || "").trim().toLowerCase();
      const blocco = document.querySelector("#" + sezione + " .contenuto");
      if (!blocco) return; // sezione sconosciuta: salto la riga

      if (sezione === "dati") {
        mostraDato(riga, blocco);
      } else {
        mostraVoce(riga, blocco);
      }
    });
  },
  error: function () {
    document.querySelector("main").textContent = "Impossibile caricare i dati del CV.";
  }
});
