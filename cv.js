// ===== Foglio Google: leggo il tab chiamato "CV" =====
const ID_FOGLIO = "1MAJD8MCsRLK6TxwnfN4JeH69zjD938KoM3-3CX_I7aA";
const URL_CV =
  "https://docs.google.com/spreadsheets/d/" +
  ID_FOGLIO +
  "/gviz/tq?tqx=out:csv&headers=1&sheet=CV";

const contenitore = document.getElementById("cv");

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
  el.className = classe;
  el.textContent = testo;
  return el;
}

// Una riga delle informazioni personali: nome + valore
function creaDato(riga) {
  const nome = pulisci(riga.titolo);
  const valore = pulisci(riga.testo);
  if (nome === "" && valore === "") {
    return null;
  }

  const div = document.createElement("div");
  div.className = "cv-dato";

  const spanNome = document.createElement("span");
  spanNome.className = "cv-nome";
  spanNome.textContent = nome;
  div.appendChild(spanNome);

  const spanValore = document.createElement("span");
  spanValore.className = "cv-valore";
  spanValore.textContent = valore;
  div.appendChild(spanValore);

  return div;
}

// Una voce della linea del tempo (istruzione o esperienza)
function creaVoce(riga) {
  const div = document.createElement("div");
  div.className = "cv-voce";

  // Aggiungo solo i campi che non sono vuoti (prima il periodo)
  const campi = [
    creaTesto("p", "cv-periodo", pulisci(riga.periodo)),
    creaTesto("h3", "cv-titolo", pulisci(riga.titolo)),
    creaTesto("p", "cv-sottotitolo", pulisci(riga.sottotitolo)),
    creaTesto("p", "cv-testo", pulisci(riga.testo))
  ];
  campi.forEach(function (campo) {
    if (campo !== null) {
      div.appendChild(campo);
    }
  });

  return div;
}

// Tessera con le informazioni personali
function creaTessera(righe) {
  const tessera = document.createElement("section");
  tessera.className = "cv-tessera";

  const h2 = document.createElement("h2");
  h2.textContent = "Informazioni personali";
  tessera.appendChild(h2);

  const griglia = document.createElement("div");
  griglia.className = "cv-dati";
  righe.forEach(function (riga) {
    const dato = creaDato(riga);
    if (dato !== null) {
      griglia.appendChild(dato);
    }
  });
  tessera.appendChild(griglia);

  return tessera;
}

// Linea del tempo con le voci
function creaLineaTempo(titolo, righe) {
  const sezione = document.createElement("section");
  sezione.className = "cv-tempo";

  const h2 = document.createElement("h2");
  h2.className = "titolo-sezione";
  h2.textContent = titolo;
  sezione.appendChild(h2);

  const linea = document.createElement("div");
  linea.className = "cv-linea";
  righe.forEach(function (riga) {
    linea.appendChild(creaVoce(riga));
  });
  sezione.appendChild(linea);

  return sezione;
}

// Legge il foglio e crea tessera + linee del tempo
Papa.parse(URL_CV, {
  download: true,
  header: true,
  skipEmptyLines: true,
  // Nomi delle colonne senza spazi e in minuscolo
  transformHeader: function (nome) {
    return nome.trim().toLowerCase();
  },
  complete: function (risultato) {
    const righe = risultato.data;

    // Leggo la sezione senza spazi e in minuscolo
    function sezioneDi(riga) {
      return pulisci(riga.sezione).toLowerCase();
    }

    // Divido le righe in base alla colonna "sezione"
    const dati = righe.filter(function (r) { return sezioneDi(r) === "dati"; });
    const istruzione = righe.filter(function (r) { return sezioneDi(r) === "istruzione"; });
    const esperienze = righe.filter(function (r) { return sezioneDi(r) === "esperienza"; });

    // Un blocco si crea solo se ha delle righe
    if (dati.length > 0) {
      contenitore.appendChild(creaTessera(dati));
    }
    if (istruzione.length > 0) {
      contenitore.appendChild(creaLineaTempo("Istruzione", istruzione));
    }
    if (esperienze.length > 0) {
      contenitore.appendChild(creaLineaTempo("Esperienze di lavoro", esperienze));
    }

    if (contenitore.children.length === 0) {
      // Messaggio con i nomi trovati, utile per capire l'errore
      const colonne = (risultato.meta.fields || []).join(", ");
      contenitore.textContent =
        "Non trovo dati nel tab CV del foglio. Colonne lette: " + colonne;
    }
  },
  error: function () {
    contenitore.textContent = "Non riesco a leggere il foglio.";
  }
});
