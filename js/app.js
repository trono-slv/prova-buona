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
        q: "Quando è entrato in applicazione il Regolamento GDPR?",
        a: ["25 maggio 2016", "25 maggio 2018", "1 gennaio 2018", "25 maggio 2020"],
        correct: 1,
        exp: "Il GDPR (Reg. UE 2016/679) è stato adottato il 27 aprile 2016 ed è entrato in applicazione il 25 maggio 2018."
    },
    {
        id: 2,
        category: "principi",
        q: "Quanti principi fondamentali del trattamento sono elencati all'Art. 5 del GDPR?",
        a: ["4", "5", "7", "9"],
        correct: 2,
        exp: "Art. 5 GDPR elenca 7 principi: liceità/correttezza/trasparenza, limitazione della finalità, minimizzazione, esattezza, limitazione della conservazione, integrità/riservatezza, responsabilizzazione."
    },
    {
        id: 3,
        category: "basi-giuridiche",
        q: "Quale tra queste NON è una base giuridica valida per il trattamento dei dati?",
        a: ["Consenso esplicito", "Interesse commerciale del titolare", "Esecuzione di un contratto", "Obbligo legale"],
        correct: 1,
        exp: "Art. 6 GDPR: l'interesse commerciale non è una base giuridica valida. Le basi sono: consenso, contratto, obbligo legale, interessi vitali, interesse pubblico, interesse legittimo."
    },
    {
        id: 4,
        category: "diritti",
        q: "Entro quanto tempo deve essere risposta una richiesta di accesso ai dati?",
        a: ["7 giorni", "15 giorni", "30 giorni", "60 giorni"],
        correct: 2,
        exp: "Art. 12 GDPR: il titolare deve rispondere senza ingiustificato ritardo e comunque entro 1 mese dalla ricezione della richiesta, prorogabile di altri 2 mesi per complessità."
    },
    {
        id: 5,
        category: "dpo",
        q: "Quando è obbligatoria la nomina del DPO?",
        a: ["Sempre per le aziende con >50 dipendenti", "Solo per le pubbliche amministrazioni", "Per trattamento su larga scala di dati sensibili", "Mai, è facoltativa"],
        correct: 2,
        exp: "Art. 37 GDPR: la nomina è obbligatoria per autorità pubbliche e organizzazioni che effettuano trattamenti su larga scala di dati sensibili o monitoraggio sistematico."
    }
    // Additional questions would follow the same pattern
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