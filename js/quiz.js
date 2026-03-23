// Quiz functionality implementation

function showDisclaimer() {
    const popup = document.getElementById('popup-disclaimer');
    if (popup) {
        popup.classList.remove('hidden');
        
        // Add event listeners only once
        const btnAccept = document.getElementById('btn-accept');
        const btnCancel = document.getElementById('btn-cancel');
        
        if (btnAccept) {
            btnAccept.onclick = function() {
                popup.classList.add('hidden');
                startQuiz();
            };
        }
        
        if (btnCancel) {
            btnCancel.onclick = function() {
                popup.classList.add('hidden');
                location.href = 'index.html';
            };
        }
    }
}

function startQuiz() {
    // Quiz initialization logic
    console.log('Quiz started');
}