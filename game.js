// ===== Game Variables =====
let gameType = '';
let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let timeLimit = 60;
let timeRemaining = 60;
let timerInterval = null;
let startTime = null;
let endTime = null;

// ===== Audio Context for Timer Sounds =====
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTickSound() {
    if (!audioContext) initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playTimeUpSound() {
    if (!audioContext) initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 400;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ===== Initialize Game =====
document.addEventListener('DOMContentLoaded', () => {
    // Get game type from URL
    const urlParams = new URLSearchParams(window.location.search);
    const typeParam = urlParams.get('type');
    
    if (typeParam) {
        gameType = typeParam;
        showScreen('settings-screen');
    }
    
    // Setup answer input listener
    const answerInput = document.getElementById('answer-input');
    answerInput.addEventListener('input', checkAnswer);
    
    // Focus on input when game starts
    answerInput.addEventListener('focus', () => {
        initAudio();
    });
});

// ===== Screen Navigation =====
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function selectGameType(type) {
    gameType = type;
    showScreen('settings-screen');
}

function backToSelection() {
    showScreen('selection-screen');
    resetGame();
}

// ===== Start Game =====
function startGame() {
    // Get settings
    const questionCount = parseInt(document.getElementById('question-count').value);
    timeLimit = parseInt(document.getElementById('time-limit').value);
    
    // Validate settings
    if (questionCount < 5 || questionCount > 100) {
        alert('Jumlah soal harus antara 5 dan 100');
        return;
    }
    
    if (timeLimit < 10 || timeLimit > 120) {
        alert('Batas waktu harus antara 10 dan 120 detik');
        return;
    }
    
    // Generate questions
    generateQuestions(questionCount);
    
    // Reset game state
    currentQuestionIndex = 0;
    correctAnswers = 0;
    timeRemaining = timeLimit;
    
    // Update UI
    document.getElementById('total-questions').textContent = questions.length;
    document.getElementById('timer').textContent = timeRemaining;
    document.getElementById('current-question').textContent = 1;
    document.getElementById('correct-count').textContent = 0;
    
    // Show first question
    showQuestion();
    
    // Start timer
    startTime = Date.now();
    startTimer();
    
    // Show game screen
    showScreen('game-screen');
    
    // Focus on input
    document.getElementById('answer-input').focus();
}

// ===== Generate Questions =====
function generateQuestions(count) {
    let pool = [];
    
    if (gameType === 'kana') {
        // Combine all hiragana and katakana
        pool = [
            ...hiragana_dasar,
            ...hiragana_dakuten,
            ...hiragana_handakuten,
            ...hiragana_youon,
            ...katakana_dasar,
            ...katakana_dakuten,
            ...katakana_handakuten,
            ...katakana_youon,
            ...katakana_modern
        ];
    } else if (gameType === 'kotoba') {
        pool = [...kotoba];
    }
    
    // Shuffle and take count
    questions = shuffleArray(pool).slice(0, Math.min(count, pool.length));
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ===== Show Question =====
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    const questionChar = document.getElementById('question-char');
    const answerInput = document.getElementById('answer-input');
    const feedback = document.getElementById('feedback');
    
    // Set question
    if (gameType === 'kana') {
        questionChar.textContent = question.char;
    } else if (gameType === 'kotoba') {
        questionChar.textContent = question.jp;
    }
    
    // Clear input and feedback
    answerInput.value = '';
    feedback.textContent = '';
    feedback.className = 'answer-feedback';
    
    // Update question number
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
}

// ===== Check Answer =====
function checkAnswer() {
    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value.trim().toLowerCase();
    
    if (!userAnswer) return;
    
    const question = questions[currentQuestionIndex];
    let correctAnswer = '';
    
    if (gameType === 'kana') {
        correctAnswer = question.romaji.toLowerCase();
    } else if (gameType === 'kotoba') {
        correctAnswer = question.romaji.toLowerCase();
    }
    
    // Check if answer is correct (case insensitive)
    if (userAnswer === correctAnswer) {
        correctAnswers++;
        document.getElementById('correct-count').textContent = correctAnswers;
        
        // Show feedback briefly
        const feedback = document.getElementById('feedback');
        feedback.textContent = '✓ Benar!';
        feedback.className = 'answer-feedback feedback-correct';
        
        // Move to next question
        setTimeout(() => {
            currentQuestionIndex++;
            showQuestion();
        }, 300);
    }
}

// ===== Timer =====
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = timeRemaining;
        
        // Warning when less than 10 seconds
        if (timeRemaining <= 10) {
            timerElement.classList.add('timer-warning');
            playTickSound();
        }
        
        // Time's up
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            playTimeUpSound();
            endGame();
        }
    }, 1000);
}

// ===== End Game =====
function endGame() {
    clearInterval(timerInterval);
    endTime = Date.now();
    
    const timeUsed = Math.floor((endTime - startTime) / 1000);
    const totalQuestions = questions.length;
    const answeredQuestions = currentQuestionIndex;
    const wrongAnswers = answeredQuestions - correctAnswers;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Calculate grade
    const grade = calculateGrade(accuracy);
    const icon = getGradeIcon(grade);
    
    // Update result screen
    document.getElementById('result-icon').textContent = icon;
    document.getElementById('result-grade').textContent = grade;
    document.getElementById('final-correct').textContent = correctAnswers;
    document.getElementById('final-total').textContent = totalQuestions;
    document.getElementById('stat-total').textContent = totalQuestions;
    document.getElementById('stat-correct').textContent = correctAnswers;
    document.getElementById('stat-wrong').textContent = wrongAnswers;
    document.getElementById('stat-accuracy').textContent = accuracy + '%';
    document.getElementById('stat-time').textContent = timeUsed + ' detik';
    
    // Show result screen
    showScreen('result-screen');
}

// ===== Calculate Grade =====
function calculateGrade(accuracy) {
    if (accuracy >= 95) return 'A+';
    if (accuracy >= 90) return 'A';
    if (accuracy >= 85) return 'B+';
    if (accuracy >= 80) return 'B';
    if (accuracy >= 75) return 'C+';
    if (accuracy >= 70) return 'C';
    if (accuracy >= 60) return 'D';
    return 'F';
}

function getGradeIcon(grade) {
    const icons = {
        'A+': '🏆',
        'A': '🌟',
        'B+': '⭐',
        'B': '👍',
        'C+': '😊',
        'C': '😐',
        'D': '😕',
        'F': '😢'
    };
    return icons[grade] || '🎮';
}

// ===== Play Again =====
function playAgain() {
    // Generate new questions with same settings
    const questionCount = questions.length;
    generateQuestions(questionCount);
    
    // Reset and start
    currentQuestionIndex = 0;
    correctAnswers = 0;
    timeRemaining = timeLimit;
    
    // Update UI
    document.getElementById('timer').textContent = timeRemaining;
    document.getElementById('timer').classList.remove('timer-warning');
    document.getElementById('current-question').textContent = 1;
    document.getElementById('correct-count').textContent = 0;
    
    // Show first question
    showQuestion();
    
    // Start timer
    startTime = Date.now();
    startTimer();
    
    // Show game screen
    showScreen('game-screen');
    
    // Focus on input
    document.getElementById('answer-input').focus();
}

// ===== Reset Game =====
function resetGame() {
    clearInterval(timerInterval);
    questions = [];
    currentQuestionIndex = 0;
    correctAnswers = 0;
    timeRemaining = 60;
    gameType = '';
}
