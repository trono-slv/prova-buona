// GDPR Quiz Application - Single Page App
// Author: Dott. Salvatore Trono

// ===== STATE MANAGEMENT =====
const APP_STATE = {
    currentView: 'view-home',
    quizState: {
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: [],
        startTime: null,
        timer: null,
        timeLeft: 20 * 60, // 20 minutes in seconds
        progress: []
    }
};

// ===== DOM ELEMENTS =====
const DOM = {
    views: {
        home: document.getElementById('view-home'),
        teoria: document.getElementById('view-teoria'),
        quiz: document.getElementById('view-quiz')
    },
    teoriaContainer: document.querySelector('.theory-container'),
    quizContainer: document.querySelector('.quiz-container'),
    popup: document.getElementById('popup-disclaimer'),
    btnHome: document.querySelectorAll('.btn-home'),
    btnStart: null,
    btnCancel: document.getElementById('btn-cancel'),
    btnAccept: document.getElementById('btn-accept')
};

// ===== THEORY CONTENT =====
const THEORY_BLOCKS = [
    {
        title: "📌 Cos'è il GDPR",
        content: "Il Regolamento Generale sulla Protezione dei Dati (GDPR) è il regolamento UE 2016/679 in vigore dal 25 maggio 2018. Si applica a tutte le organizzazioni che trattano dati personali di cittadini UE, indipendentemente dalla loro ubicazione."
    },
    {
        title: "🏛️ Principi del Trattamento",
        content: "Art. 5 GDPR: liceità, correttezza e trasparenza; limitazione delle finalità; minimizzazione dei dati; esattezza; limitazione della conservazione; integrità e riservatezza; responsabilizzazione (accountability)."
    },
    {
        title: "✅ Basi Giuridiche",
        content: "Art. 6 GDPR: consenso dell'interessato; esecuzione di un contratto; obbligo legale; protezione di interessi vitali; interesse pubblico; interesse legittimo del titolare."
    },
    {
        title: "👤 Diritti dell'Interessato",
        content: "Art. 15-22 GDPR: diritto di accesso; rettifica; cancellazione (oblio); limitazione del trattamento; portabilità dei dati; opposizione al trattamento."
    },
    {
        title: "🏢 Titolare e Responsabile",
        content: "Titolare: determina finalità e mezzi del trattamento. Responsabile: tratta dati per conto del titolare. Obbligo di accordo scritto (Art. 28) che specifichi oggetto, durata, natura e finalità del trattamento."
    },
    {
        title: "🛡️ DPO - Data Protection Officer",
        content: "Figura obbligatoria per: autorità pubbliche; trattamento su larga scala di dati sensibili; monitoraggio sistematico su larga scala. Requisiti: competenze giuridiche e informatiche, indipendenza (Art. 37-39)."
    },
    {
        title: "🔔 Data Breach",
        content: "Art. 33: notifica al Garante entro 72 ore dalla scoperta. Art. 34: comunicazione agli interessati se rischio elevato per diritti e libertà."
    },
    {
        title: "🔒 Privacy by Design & Default",
        content: "Art. 25: integrare misure di protezione fin dalla progettazione (by design) e garantire che per impostazione predefinita (by default) siano trattati solo i dati necessari."
    },
    {
        title: "📊 DPIA - Valutazione d'Impatto",
        content: "Art. 35: obbligatoria per trattamenti ad alto rischio (monitoraggio sistematico, dati sensibili su larga scala, valutazione sistematica di aspetti personali). Deve descrivere trattamento, rischi e misure di sicurezza."
    },
    {
        title: "⚖️ Sanzioni",
        content: "Art. 83: fino a €20M o 4% del fatturato globale per violazioni dei principi base, diritti interessati, trasferimenti illeciti. Fino a €10M o 2% per altre violazioni (obblighi DPO, registro, sicurezza)."
    }
];

// ===== QUIZ QUESTIONS =====
const QUESTIONS = [
     {
    id: 1,
    category: "principi",
    q: "Che cosa si intende per dato personale?",
    a: [
      "Solo i dati sanitari",
      "Qualsiasi informazione riferita a una persona identificata o identificabile",
      "Solo nome e cognome",
      "Solo i dati contenuti nei documenti ufficiali"
    ],
    correct: 1,
    exp: "Un dato personale è qualsiasi informazione riferita a una persona identificata o identificabile, anche indirettamente."
  },
  {
    id: 2,
    category: "principi",
    q: "Qual è l’obiettivo di una corretta protezione dei dati in ufficio?",
    a: [
      "Conservare tutto senza distinzione",
      "Limitare il lavoro degli operatori",
      "Gestire le informazioni in modo riservato, corretto e controllato",
      "Usare solo archivi cartacei"
    ],
    correct: 2,
    exp: "La protezione dei dati richiede un uso corretto, riservato e controllato delle informazioni trattate nelle attività d’ufficio."
  },
  {
    id: 3,
    category: "principi",
    q: "Quale comportamento riflette il principio di necessità?",
    a: [
      "Accedere solo alle informazioni utili per il proprio compito",
      "Consultare tutte le pratiche per cultura personale",
      "Stampare sempre tutto per sicurezza",
      "Condividere i dati con l’intero ufficio"
    ],
    correct: 0,
    exp: "Il principio di necessità impone di utilizzare solo i dati realmente utili per svolgere il proprio compito."
  },
  {
    id: 4,
    category: "postazione",
    q: "Che cosa significa mantenere una postazione di lavoro ordinata?",
    a: [
      "Lasciare visibili i documenti più usati",
      "Ridurre il numero di email in arrivo",
      "Custodire documenti e informazioni in modo da non esporli inutilmente",
      "Tenere tutto sulla scrivania per velocizzare il lavoro"
    ],
    correct: 2,
    exp: "Una postazione ordinata riduce il rischio che dati e documenti siano visti da persone non autorizzate."
  },
  {
    id: 5,
    category: "postazione",
    q: "Quando ci si allontana dalla postazione, quale comportamento è corretto?",
    a: [
      "Lasciare il computer aperto se si torna presto",
      "Bloccare la sessione e mettere in sicurezza i documenti",
      "Lasciare i fascicoli aperti per riprendere più facilmente",
      "Spegnere solo il monitor"
    ],
    correct: 1,
    exp: "Anche un’assenza breve richiede attenzione: sessione bloccata e documenti non esposti."
  },
  {
    id: 6,
    category: "reception",
    q: "Qual è il comportamento più corretto alla reception?",
    a: [
      "Lasciare il registro visitatori aperto sul banco",
      "Raccogliere solo i dati necessari e non renderli visibili agli altri",
      "Chiedere sempre il maggior numero possibile di dati",
      "Comunicare ad alta voce il motivo della visita"
    ],
    correct: 1,
    exp: "Alla reception bisogna limitare i dati raccolti e impedire che altri visitatori possano leggerli o ascoltarli."
  },
  {
    id: 7,
    category: "telefonate",
    q: "Qual è una buona pratica con le telefonate in reception?",
    a: [
      "Dare sempre conferma della presenza di una persona in sede",
      "Condividere il numero diretto personale del dipendente",
      "Limitare le informazioni e verificare chi chiama",
      "Leggere ad alta voce il calendario appuntamenti"
    ],
    correct: 2,
    exp: "Le informazioni vanno comunicate con prudenza e solo se vi è adeguata legittimazione."
  },
  {
    id: 8,
    category: "documenti",
    q: "Perché i documenti cartacei richiedono attenzione?",
    a: [
      "Perché sono sempre più importanti dei file digitali",
      "Perché possono essere facilmente lasciati incustoditi o letti da terzi",
      "Perché non possono essere copiati",
      "Perché sono sempre riservati"
    ],
    correct: 1,
    exp: "I documenti cartacei, se lasciati esposti o non custoditi, possono essere letti da soggetti non autorizzati."
  },
  {
    id: 9,
    category: "documenti",
    q: "Che cosa indica l’espressione clean desk?",
    a: [
      "Pulire la scrivania a fine settimana",
      "Tenere il computer senza file",
      "Lasciare sulla scrivania solo ciò che serve e riporre il resto",
      "Usare solo documenti digitali"
    ],
    correct: 2,
    exp: "La logica clean desk consiste nel non lasciare esposti documenti, appunti o informazioni non necessari."
  },
  {
    id: 10,
    category: "documenti",
    q: "Perché stampanti e scanner sono punti sensibili?",
    a: [
      "Perché funzionano solo in rete",
      "Perché aumentano il rumore",
      "Perché rappresentano punti di passaggio critici dei documenti",
      "Perché non si possono controllare"
    ],
    correct: 2,
    exp: "Stampanti e scanner sono punti sensibili perché i documenti possono essere lasciati incustoditi, visti o inviati con errori."
  },
  {
    id: 11,
    category: "telefonate",
    q: "In una telefonata di lavoro, quale comportamento è corretto?",
    a: [
      "Dare sempre tutte le informazioni richieste",
      "Parlare ad alta voce per farsi capire meglio",
      "Gestire la chiamata con prudenza e fornire solo ciò che è dovuto",
      "Rispondere senza verificare chi chiama"
    ],
    correct: 2,
    exp: "La cortesia non giustifica la comunicazione impropria di informazioni."
  },
  {
    id: 12,
    category: "reception",
    q: "Nelle aree reception occorre particolare attenzione perché:",
    a: [
      "Sono sempre videosorvegliate",
      "Sono ambienti più esposti a sguardi e ascolti di terzi",
      "Hanno meno documenti",
      "Non richiedono ordine"
    ],
    correct: 1,
    exp: "Sono aree in cui interno ed esterno si incontrano e il rischio di esposizione è maggiore."
  },
  {
    id: 13,
    category: "conversazioni",
    q: "Parlare di pratiche riservate in corridoio è scorretto perché:",
    a: [
      "Rallenta il lavoro",
      "Può rendere udibili informazioni a persone non autorizzate",
      "Impedisce l’uso del telefono",
      "Obbliga a scrivere un verbale"
    ],
    correct: 1,
    exp: "Anche le conversazioni possono divulgare impropriamente informazioni."
  },
  {
    id: 14,
    category: "condivisione",
    q: "Qual è un rischio tipico delle cartelle condivise?",
    a: [
      "Consentono automaticamente la cifratura",
      "Possono favorire accessi non necessari o non controllati",
      "Impediscono il salvataggio dei file",
      "Servono solo per i backup"
    ],
    correct: 1,
    exp: "Se troppo aperte o disordinate, aumentano accessi impropri e dispersione dei file."
  },
  {
    id: 15,
    category: "archiviazione",
    q: "Archiviare correttamente significa:",
    a: [
      "Mettere tutto nella stessa cartella",
      "Conservare tutto senza criteri",
      "Applicare criteri chiari di ordine, accesso e reperibilità",
      "Stampare sempre una copia cartacea"
    ],
    correct: 2,
    exp: "Archiviare bene significa sapere cosa si conserva, dove, per quanto tempo e chi può accedervi."
  },
  {
    id: 16,
    category: "archiviazione",
    q: "Conservare documenti inutili per troppo tempo è un problema perché:",
    a: [
      "Riduce il numero di pratiche",
      "Aumenta il rischio di conservare dati oltre il necessario",
      "Migliora sempre l’organizzazione",
      "Evita ogni errore"
    ],
    correct: 1,
    exp: "Accumula materiale non più necessario e aumenta il rischio di disordine, accessi impropri e perdita di controllo."
  },
  {
    id: 17,
    category: "archiviazione",
    q: "La distruzione dei documenti deve essere:",
    a: [
      "Casuale, purché rapida",
      "Uguale per ogni tipo di carta",
      "Compatibile con il contenuto e le procedure interne",
      "Demandata sempre a chiunque sia disponibile"
    ],
    correct: 2,
    exp: "Anche l’eliminazione fa parte della protezione dei dati e va gestita in modo sicuro."
  },
  {
    id: 18,
    category: "documenti",
    q: "Un documento con dati personali buttato nel cestino ordinario può essere:",
    a: [
      "Irrilevante se è una bozza",
      "Recuperabile e leggibile da terzi",
      "Automaticamente anonimizzato",
      "Sempre innocuo"
    ],
    correct: 1,
    exp: "Se leggibile, può essere recuperato o visto da persone non autorizzate."
  },
  {
    id: 19,
    category: "password",
    q: "Perché la password ha anche un valore di responsabilità personale?",
    a: [
      "Perché serve solo a ricordare il computer",
      "Perché identifica e responsabilizza l’uso dell’account",
      "Perché sostituisce i documenti cartacei",
      "Perché elimina ogni rischio"
    ],
    correct: 1,
    exp: "La password collega l’azione effettuata all’utente che ha usato quell’account."
  },
  {
    id: 20,
    category: "password",
    q: "Quale tra questi comportamenti è corretto rispetto alle password?",
    a: [
      "Condividerle con un collega fidato",
      "Scriverle sotto la tastiera",
      "Usarle in modo personale e riservato",
      "Lasciarle uguali per tutti gli account di reparto"
    ],
    correct: 2,
    exp: "Le credenziali non vanno condivise e devono essere custodite con attenzione."
  },
  {
    id: 21,
    category: "email",
    q: "Il phishing sfrutta soprattutto:",
    a: [
      "Solo guasti hardware",
      "Fretta, distrazione e fiducia non verificata",
      "Esclusivamente errori di stampa",
      "Solo telefonate interne"
    ],
    correct: 1,
    exp: "Il phishing fa leva su fretta, automatismi, fiducia e apparenza di legittimità."
  },
  {
    id: 22,
    category: "email",
    q: "Davanti a una mail sospetta è opportuno:",
    a: [
      "Aprire subito l’allegato per capire",
      "Rispondere per chiedere conferma al mittente sospetto",
      "Verificare il contesto e segnalare se anomala",
      "Inoltrarla a tutti i colleghi"
    ],
    correct: 2,
    exp: "La prudenza richiede verifica prima di cliccare o inserire credenziali."
  },
  {
    id: 23,
    category: "incidenti",
    q: "Che cosa bisogna fare se ci si accorge di un invio errato di dati?",
    a: [
      "Aspettare e vedere se qualcuno se ne accorge",
      "Cancellare subito ogni traccia senza dirlo",
      "Segnalare immediatamente l’accaduto secondo le procedure interne",
      "Ignorare l’evento se l’errore è piccolo"
    ],
    correct: 2,
    exp: "La tempestività della segnalazione è essenziale per limitare gli effetti dell’incidente."
  },
  {
    id: 24,
    category: "incidenti",
    q: "Perché nascondere un errore è scorretto?",
    a: [
      "Perché rallenta il lavoro dei colleghi",
      "Perché impedisce una gestione tempestiva dell’incidente",
      "Perché obbliga a stampare di più",
      "Perché modifica le password"
    ],
    correct: 1,
    exp: "Ritardare la segnalazione peggiora spesso la gestione dell’evento e può aumentarne l’impatto."
  },
  {
    id: 25,
    category: "abitudini",
    q: "Gli errori più frequenti in ufficio derivano spesso da:",
    a: [
      "Solo eventi eccezionali",
      "Abitudini scorrette quotidiane",
      "Solo guasti tecnici gravi",
      "Sistemi sempre troppo complessi"
    ],
    correct: 1,
    exp: "Spesso gli errori derivano da piccoli comportamenti scorretti ripetuti fino a diventare abitudine."
  },
  {
    id: 26,
    category: "abitudini",
    q: "Una buona pratica quotidiana è:",
    a: [
      "Controllare sempre destinatari e allegati prima dell’invio",
      "Lasciare la verifica finale all’abitudine",
      "Rimandare l’ordine della postazione a fine settimana",
      "Tenere appunti riservati sul banco per praticità"
    ],
    correct: 0,
    exp: "Le buone prassi sono efficaci quando diventano routine semplici e costanti."
  },
  {
    id: 27,
    category: "responsabilita",
    q: "La responsabilità individuale nella protezione dei dati significa che:",
    a: [
      "Conta solo chi gestisce i server",
      "Ogni lavoratore deve agire con attenzione nel proprio ruolo",
      "La riservatezza è solo responsabilità del dirigente",
      "Basta conoscere la teoria senza applicarla"
    ],
    correct: 1,
    exp: "Ogni persona incide concretamente sulla sicurezza delle informazioni con il proprio comportamento."
  },
  {
    id: 28,
    category: "reception",
    q: "In reception, un monitor orientato verso il pubblico può essere problematico perché:",
    a: [
      "Riduce la luminosità",
      "Può rendere visibili dati a terzi",
      "Aumenta il consumo di energia",
      "Impedisce l’uso del mouse"
    ],
    correct: 1,
    exp: "Un monitor visibile al pubblico può esporre informazioni a persone che non dovrebbero vederle."
  },
  {
    id: 29,
    category: "password",
    q: "Un post-it con credenziali attaccato al monitor rappresenta:",
    a: [
      "Un aiuto organizzativo corretto",
      "Una pratica accettabile se l’ufficio è piccolo",
      "Un rischio di accesso non autorizzato",
      "Un obbligo operativo"
    ],
    correct: 2,
    exp: "È una delle forme più tipiche di esposizione impropria delle credenziali."
  },
  {
    id: 30,
    category: "email",
    q: "Qual è la regola corretta sugli allegati email?",
    a: [
      "Inviarli senza aprirli per fare prima",
      "Verificarne correttezza e pertinenza prima dell’invio",
      "Allegare sempre tutta la pratica completa",
      "Usare lo stesso allegato per tutti i destinatari"
    ],
    correct: 1,
    exp: "Occorre verificare che il file allegato sia quello giusto e contenga solo ciò che serve."
  },
  {
    id: 31,
    category: "telefonate",
    q: "Quando si riceve una richiesta telefonica di informazioni, è corretto:",
    a: [
      "Fornire subito tutti i dettagli per cortesia",
      "Comunicare solo le informazioni appropriate dopo adeguata verifica",
      "Leggere l’intera pratica al telefono",
      "Rispondere sempre in viva voce"
    ],
    correct: 1,
    exp: "Occorre prudenza sull’identità, sul ruolo del richiedente e sul contenuto da comunicare."
  },
  {
    id: 32,
    category: "documenti",
    q: "Le stampe lasciate nel vassoio della multifunzione:",
    a: [
      "Non costituiscono problema se l’ufficio è interno",
      "Sono sicure finché la stampante è aziendale",
      "Possono esporre dati a terzi se non ritirate subito",
      "Sono rilevanti solo se a colori"
    ],
    correct: 2,
    exp: "Possono essere viste o ritirate da persone diverse dal destinatario previsto."
  },
  {
    id: 33,
    category: "condivisione",
    q: "Una cartella condivisa ben gestita dovrebbe:",
    a: [
      "Essere accessibile a tutti senza limiti",
      "Contenere file con nomi generici",
      "Avere accessi coerenti con i ruoli e struttura ordinata",
      "Evitare qualsiasi regola di archiviazione"
    ],
    correct: 2,
    exp: "Una buona gestione prevede ordine, limiti di accesso e criteri di denominazione chiari."
  },
  {
    id: 34,
    category: "principi",
    q: "Qual è un esempio di minimizzazione dei dati?",
    a: [
      "Chiedere sempre più informazioni per prevenzione",
      "Registrare il minimo necessario per svolgere il compito",
      "Fotocopiare tutti i documenti ricevuti",
      "Conservare appunti personali su ogni utente"
    ],
    correct: 1,
    exp: "Minimizzazione significa raccogliere solo ciò che serve rispetto allo scopo concreto dell’attività."
  },
  {
    id: 35,
    category: "conversazioni",
    q: "Le conversazioni tra colleghi su pratiche delicate dovrebbero:",
    a: [
      "Avvenire ovunque purché rapide",
      "Essere fatte ad alta voce per chiarezza",
      "Limitarsi al necessario e svolgersi con riservatezza",
      "Includere dettagli utili anche a chi ascolta casualmente"
    ],
    correct: 2,
    exp: "Le pratiche delicate vanno trattate con discrezione, tono adeguato e nel contesto giusto."
  },
  {
    id: 36,
    category: "archiviazione",
    q: "Un archivio disordinato aumenta il rischio di:",
    a: [
      "Migliore controllo dei documenti",
      "Minore tempo di ricerca",
      "Smarrimenti, duplicazioni e accessi non necessari",
      "Aggiornamento automatico dei dati"
    ],
    correct: 2,
    exp: "Disordine e assenza di criteri favoriscono smarrimenti, duplicazioni e accessi impropri."
  },
  {
    id: 37,
    category: "reception",
    q: "Se un visitatore entra in un’area operativa, il comportamento corretto è:",
    a: [
      "Lasciarlo muovere liberamente se attende poco",
      "Accompagnarlo e limitare l’accesso alle sole aree necessarie",
      "Mostrargli i documenti utili per orientarsi",
      "Farlo attendere alla postazione operativa"
    ],
    correct: 1,
    exp: "L’accesso del visitatore va accompagnato e limitato alle sole aree necessarie."
  },
  {
    id: 38,
    category: "supporti",
    q: "Perché una chiavetta USB può essere critica nella gestione dei dati?",
    a: [
      "Perché non consente di rinominare i documenti",
      "Perché aumenta il numero di cartelle",
      "Perché può favorire trasferimenti e copie non controllate",
      "Perché rallenta sempre la tastiera"
    ],
    correct: 2,
    exp: "Può facilitare copie non controllate, trasferimenti impropri o smarrimenti di file."
  },
  {
    id: 39,
    category: "postazione",
    q: "Qual è l’effetto di un ambiente ordinato sulla protezione dei dati?",
    a: [
      "Ha solo un effetto estetico",
      "Riduce controllo e reperibilità",
      "Aumenta il rischio di smarrimento",
      "Favorisce controllo, reperibilità e riduzione degli errori"
    ],
    correct: 3,
    exp: "L’ordine aiuta a sapere dove sono i documenti, chi li usa e come proteggerli meglio."
  },
  {
    id: 40,
    category: "postazione",
    q: "Quale comportamento è scorretto rispetto ai documenti lasciati sulla scrivania?",
    a: [
      "Riporli quando non servono",
      "Lasciarli visibili anche durante assenze brevi",
      "Limitare la visibilità dei fascicoli aperti",
      "Usare contenitori o cassetti per custodirli"
    ],
    correct: 1,
    exp: "I documenti non devono restare esposti inutilmente a terzi o colleghi non coinvolti."
  },
  {
    id: 41,
    category: "documenti",
    q: "Quando si scannerizza un documento bisogna prestare attenzione soprattutto a:",
    a: [
      "Solo al colore della scansione",
      "Destinatario, salvataggio e correttezza del file",
      "Solo alla velocità del dispositivo",
      "Alla quantità di carta nel vassoio"
    ],
    correct: 1,
    exp: "Non basta acquisire il documento: bisogna controllare destinatario, nome file e collocazione."
  },
  {
    id: 42,
    category: "documenti",
    q: "Una bozza contenente dati personali:",
    a: [
      "È sempre irrilevante perché non definitiva",
      "Può richiedere le stesse cautele di altri documenti",
      "Può essere lasciata ovunque",
      "Non va mai distrutta"
    ],
    correct: 1,
    exp: "Anche bozze e appunti possono contenere informazioni da proteggere."
  },
  {
    id: 43,
    category: "email",
    q: "Perché il completamento automatico dell’email è rischioso?",
    a: [
      "Perché rallenta la scrittura",
      "Perché cancella gli allegati",
      "Perché può indurre invii al destinatario sbagliato",
      "Perché modifica il testo"
    ],
    correct: 2,
    exp: "Può far selezionare un destinatario errato senza che l’operatore se ne accorga."
  },
  {
    id: 44,
    category: "principi",
    q: "Nel trattamento dei dati, la curiosità personale:",
    a: [
      "È accettabile se non si racconta a nessuno",
      "Può giustificare l’accesso a pratiche non assegnate",
      "Non giustifica mai la consultazione di dati non necessari",
      "È utile per imparare meglio il lavoro"
    ],
    correct: 2,
    exp: "La consultazione deve dipendere dal ruolo e dal compito, non dall’interesse personale."
  },
  {
    id: 45,
    category: "procedure",
    q: "Qual è il vantaggio di procedure semplici e condivise?",
    a: [
      "Aumentano la confusione",
      "Eliminano il bisogno di attenzione",
      "Aiutano a lavorare in modo coerente e più sicuro",
      "Servono solo ai nuovi assunti"
    ],
    correct: 2,
    exp: "Rendono più uniformi i comportamenti e riducono gli errori dovuti a improvvisazione."
  },
  {
    id: 46,
    category: "principi",
    q: "Che cosa significa trattare i dati con sobrietà?",
    a: [
      "Essere sbrigativi nelle pratiche",
      "Ridurre la qualità del servizio",
      "Limitarsi allo stretto necessario nel proprio ruolo",
      "Parlare poco con tutti"
    ],
    correct: 2,
    exp: "Significa usare, comunicare e consultare solo ciò che serve, senza eccedenze o curiosità."
  },
  {
    id: 47,
    category: "reception",
    q: "In un ufficio, quale tra questi è un dato personale?",
    a: [
      "Solo il codice fiscale",
      "Solo il numero di carta d’identità",
      "Qualsiasi informazione riferibile a una persona identificata o identificabile",
      "Solo i dati sanitari"
    ],
    correct: 2,
    exp: "È dato personale qualsiasi informazione che consente di identificare direttamente o indirettamente una persona."
  },
  {
    id: 48,
    category: "postazione",
    q: "Quale comportamento aiuta a ridurre il rischio di esposizione dei dati sullo schermo?",
    a: [
      "Orientare il monitor in modo non visibile a terzi",
      "Aumentare sempre la luminosità",
      "Lasciare aperte più finestre possibili",
      "Usare caratteri più grandi per tutti"
    ],
    correct: 0,
    exp: "L’orientamento del monitor è una misura semplice ma efficace per ridurre l’esposizione visiva dei dati."
  },
  {
    id: 49,
    category: "email",
    q: "Prima di inviare un’email con allegati, quale controllo è essenziale?",
    a: [
      "Verificare destinatari, oggetto e allegato",
      "Controllare solo la firma automatica",
      "Cambiare il nome del file ogni volta",
      "Stampare l’email per archiviarla"
    ],
    correct: 0,
    exp: "Uno dei controlli più importanti è verificare attentamente destinatari e allegati prima dell’invio."
  },
  {
    id: 50,
    category: "responsabilita",
    q: "Quale affermazione descrive meglio una corretta cultura della protezione dei dati?",
    a: [
      "È un tema che riguarda solo l’IT",
      "È una responsabilità diffusa che richiede attenzione quotidiana",
      "Riguarda solo chi lavora alla reception",
      "Serve solo in caso di controlli esterni"
    ],
    correct: 1,
    exp: "La protezione dei dati non riguarda solo la tecnologia: dipende dai comportamenti quotidiani di tutti."
  },
    {
        id: 51,
        category: "principi",
        q: "Quando è entrato in applicazione il Regolamento GDPR?",
        a: ["25 maggio 2016", "25 maggio 2018", "1 gennaio 2018", "25 maggio 2020"],
        correct: 1,
        exp: "Il GDPR (Reg. UE 2016/679) è stato adottato il 27 aprile 2016 ed è entrato in applicazione il 25 maggio 2018."
    },
    {
        id: 52,
        category: "principi",
        q: "Quanti principi fondamentali del trattamento sono elencati all'Art. 5 del GDPR?",
        a: ["4", "5", "7", "9"],
        correct: 2,
        exp: "Art. 5 GDPR elenca 7 principi: liceità/correttezza/trasparenza, limitazione della finalità, minimizzazione, esattezza, limitazione della conservazione, integrità/riservatezza, responsabilizzazione."
    },
    {
        id: 53,
        category: "basi-giuridiche",
        q: "Quale tra queste NON è una base giuridica valida per il trattamento dei dati?",
        a: ["Consenso esplicito", "Interesse commerciale del titolare", "Esecuzione di un contratto", "Obbligo legale"],
        correct: 1,
        exp: "Art. 6 GDPR: l'interesse commerciale non è una base giuridica valida. Le basi sono: consenso, contratto, obbligo legale, interessi vitali, interesse pubblico, interesse legittimo."
    },
    {
        id: 54,
        category: "diritti",
        q: "Entro quanto tempo deve essere risposta una richiesta di accesso ai dati?",
        a: ["7 giorni", "15 giorni", "30 giorni", "60 giorni"],
        correct: 2,
        exp: "Art. 12 GDPR: il titolare deve rispondere senza ingiustificato ritardo e comunque entro 1 mese dalla ricezione della richiesta, prorogabile di altri 2 mesi per complessità."
    },
    {
        id: 55,
        category: "dpo",
        q: "Quando è obbligatoria la nomina del DPO?",
        a: ["Sempre per le aziende con >50 dipendenti", "Solo per le pubbliche amministrazioni", "Per trattamento su larga scala di dati sensibili", "Mai, è facoltativa"],
        correct: 2,
        exp: "Art. 37 GDPR: la nomina è obbligatoria per autorità pubbliche e organizzazioni che effettuano trattamenti su larga scala di dati sensibili o monitoraggio sistematico."
    }
    ];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheorySection();
    initPopup();
    initQuizSection();
});

// ===== NAVIGATION FUNCTIONS =====
function initNavigation() {
    // Home navigation buttons
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const target = this.dataset.target;
            if(target === 'external') {
                window.open('https://eur-lex.europa.eu/eli/reg/2016/679/oj', '_blank');
            } else {
                showView(target);
                
                // Special handling for teoria view
                if(target === 'view-teoria') {
                    renderTheoryContent();
                }
            }
        });
    });

    // Back to home buttons
    DOM.btnHome.forEach(btn => {
        btn.addEventListener('click', () => showView('view-home'));
    });
}

function showView(viewId) {
    // Hide all views
    Object.values(DOM.views).forEach(view => {
        view.classList.remove('active');
    });

    // Show requested view
    DOM.views[viewId.split('-')[1]].classList.add('active');
    APP_STATE.currentView = viewId;

    // Initialize view-specific content
    if(viewId === 'view-teoria') {
        renderTheoryContent();
    } else if(viewId === 'view-quiz') {
        renderQuizWelcome();
    }
}

// ===== THEORY SECTION =====
function initTheorySection() {
    // Ensure DOM.teoriaContainer exists
    if (!DOM.teoriaContainer) return;
    
    // Add event listener only if element exists
    const btnQuiz = document.getElementById('btn-quiz');
    if (btnQuiz) {
        btnQuiz.addEventListener('click', () => {
            switchView('view-quiz');
        });
    }
    // Accordion functionality
    DOM.teoriaContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('theory-title')) {
            const content = e.target.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
            e.target.querySelector('.toggle-icon').textContent = 
                content.style.display === 'block' ? '−' : '+';
        }
    });
}

function renderTheoryContent() {
    DOM.teoriaContainer.innerHTML = THEORY_BLOCKS.map(block => `
        <div class="theory-block">
            <div class="theory-title">
                <span class="toggle-icon">+</span>
                <h3>${block.title}</h3>
            </div>
            <div class="theory-content" style="display:none">
                <p>${block.content}</p>
                <div class="theory-actions">
                    <button class="btn-quiz" data-topic="${block.title.split(' ')[0]}">Quiz su questo argomento</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add quiz navigation handlers
    document.querySelectorAll('.btn-quiz').forEach(btn => {
        btn.addEventListener('click', function() {
            const topic = this.dataset.topic;
            showView('view-quiz');
            // Filter quiz questions by topic
            const filteredQuestions = QUESTIONS.filter(q => q.category === topic.toLowerCase());
            if(filteredQuestions.length > 0) {
                APP_STATE.quizState.questions = filteredQuestions;
                startQuiz();
            } else {
                renderQuizWelcome();
            }
        });
    });
}

// ===== POPUP FUNCTIONS =====
function showDisclaimer() {
    DOM.popup.classList.remove('hidden');
}

function initPopup() {
    DOM.btnCancel.addEventListener('click', () => {
        DOM.popup.classList.add('hidden');
    });

    DOM.btnAccept.addEventListener('click', () => {
        DOM.popup.classList.add('hidden');
        startQuiz();
    });
}

// ===== QUIZ FUNCTIONS =====
function initQuizSection() {
    // Will be initialized when quiz view is shown
}

function renderQuizWelcome() {
    DOM.quizContainer.innerHTML = `
        <div class="quiz-welcome">
            <h2>Test GDPR - Regolamento UE 2016/679</h2>
            <p>Verifica le tue conoscenze sul GDPR con questo test di 10 domande</p>
            <p>Hai a disposizione 20 minuti per completare il test</p>
            <button id="btn-start" class="btn-start">AVVIA IL TEST</button>
        </div>
    `;

    DOM.btnStart = document.getElementById('btn-start');
    DOM.btnStart.addEventListener('click', () => {
        DOM.popup.classList.remove('hidden');
    });
}

function startQuiz() {
    // Initialize quiz state
    APP_STATE.quizState = {
        questions: getRandomQuestions(10),
        currentQuestionIndex: 0,
        userAnswers: [],
        startTime: Date.now(),
        timer: setInterval(updateTimer, 1000),
        timeLeft: 20 * 60,
        progress: []
    };

    renderQuestion();
    startTimer();
}

function getRandomQuestions(count) {
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function renderQuestion() {
    const { questions, currentQuestionIndex } = APP_STATE.quizState;
    const question = questions[currentQuestionIndex];
    
    if(!question) {
        showResults();
        return;
    }

    // Shuffle answer options
    let answers = [...question.a];
    const correctAnswer = answers[question.correct];
    
    // Shuffle options while preserving correct answer
    answers = shuffleArray(answers);
    const correctIndex = answers.indexOf(correctAnswer);
    
    DOM.quizContainer.innerHTML = `
        <div class="quiz-question">
            <div class="progress-bar">
                <div class="progress" style="width: ${(currentQuestionIndex / questions.length) * 100}%"></div>
                <div class="progress-text">${currentQuestionIndex + 1}/${questions.length}</div>
            </div>
            
            <div class="timer">Tempo rimanente: <span id="time-left">20:00</span></div>
            
            <h3>${question.q}</h3>
            
            <div class="options">
                ${answers.map((answer, i) => `
                    <div class="option" data-index="${i}">
                        <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="option-text">${answer}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Add option selection handlers
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            const selectedIndex = parseInt(this.dataset.index);
            const questionId = questions[currentQuestionIndex].id;
            APP_STATE.quizState.userAnswers.push(selectedIndex);
            APP_STATE.quizState.progress.push({
                questionId,
                timestamp: Date.now(),
                selectedAnswer: selectedIndex
            });
            APP_STATE.quizState.currentQuestionIndex++;
            renderQuestion();
        });
    });
}

function startTimer() {
    const timerDisplay = document.getElementById('time-left');
    
    APP_STATE.quizState.timer = setInterval(() => {
        APP_STATE.quizState.timeLeft--;
        
        const minutes = Math.floor(APP_STATE.quizState.timeLeft / 60);
        const seconds = APP_STATE.quizState.timeLeft % 60;
        
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Alert when 5 minutes left
        if(APP_STATE.quizState.timeLeft === 5 * 60) {
            alert('⏰ Attenzione! Rimangono meno di 5 minuti!');
        }
        
        // End quiz when time expires
        if(APP_STATE.quizState.timeLeft <= 0) {
            clearInterval(APP_STATE.quizState.timer);
            showResults();
        }
    }, 1000);
}

function showResults() {
    clearInterval(APP_STATE.quizState.timer);
    
    const { questions, userAnswers, progress } = APP_STATE.quizState;
    const correctCount = userAnswers.reduce((count, answer, index) => {
        return count + (answer === questions[index].correct ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctCount / questions.length) * 100);
    
    DOM.quizContainer.innerHTML = `
        <div class="quiz-results">
            <h2>Risultati del Test</h2>
            <div class="score ${score >= 80 ? 'excellent' : score >= 60 ? 'sufficient' : 'insufficient'}">
                ${score}% - ${score >= 80 ? 'Eccellente 🏆' : score >= 60 ? 'Sufficiente 👍' : 'Insufficiente 📚'}
            </div>
            <p>Hai risposto correttamente a ${correctCount} domande su ${questions.length}</p>
            
            <div class="results-summary">
                <div class="summary-item">
                    <span class="summary-label">Tempo impiegato:</span>
                    <span class="summary-value">${formatTime((20*60) - timeLeft)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Progresso:</span>
                    <span class="summary-value">${progress.length}/${questions.length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Punteggio:</span>
                    <span class="summary-value">${correctCount}/${questions.length}</span>
                </div>
            </div>
            
            <div class="results-details">
                <h3>Dettaglio risposte:</h3>
                ${questions.map((q, i) => {
                    const userAnswer = userAnswers[i];
                    const isCorrect = userAnswer === q.correct;
                    return `
                        <div class="question-result ${isCorrect ? 'correct' : 'incorrect'}">
                            <p><strong>Domanda ${i+1}:</strong> ${q.q}</p>
                            <p>La tua risposta: ${q.a[userAnswer]} ${isCorrect ? '✅' : '❌'}</p>
                            ${!isCorrect ? `<p>Risposta corretta: ${q.a[q.correct]}</p>` : ''}
                            <p class="explanation">${q.exp}</p>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="results-actions">
                <button class="btn-restart">Riprova il Test</button>
                <button class="btn-review">Rivedi Risposte</button>
                <button class="btn-home">Torna alla Home</button>
            </div>
        </div>
    `;
    
    // Add event listener to home button
    document.querySelector('.quiz-results .btn-home').addEventListener('click', () => {
        showView('view-home');
    });
    
    document.querySelector('.quiz-results .btn-restart').addEventListener('click', () => {
        startQuiz();
    });
    
    document.querySelector('.quiz-results .btn-review').addEventListener('click', () => {
        APP_STATE.quizState.currentQuestionIndex = 0;
        renderQuestion();
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Make showDisclaimer globally accessible
window.showDisclaimer = showDisclaimer;
