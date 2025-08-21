let gameArea, startBtn, scoreDisplay, highScoreDisplay, timerDisplay, clickSound;
let score = 0;
let timerInterval;
let targetBtn;
let highScore = 0;
let currentTime = 0;
let lizardTimeout;

function loadHighScore() {
    const stored = localStorage.getItem('highScore');
    highScore = stored ? parseInt(stored, 10) : 0;
    highScoreDisplay.textContent = 'High Score: ' + highScore;
}

function saveHighScore(newScore) {
    localStorage.setItem('highScore', newScore);
}

function randomPosition() {
    // Create a temporary button to measure its size for accurate placement
    let tempBtn = document.createElement('button');
    tempBtn.id = 'targetBtn';
    tempBtn.textContent = '🦎';
    tempBtn.style.visibility = 'hidden';
    tempBtn.style.position = 'absolute';
    gameArea.appendChild(tempBtn);
    const btnWidth = tempBtn.offsetWidth;
    const btnHeight = tempBtn.offsetHeight;
    gameArea.removeChild(tempBtn);

    const style = window.getComputedStyle(gameArea);
    const areaWidth = gameArea.clientWidth - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
    const areaHeight = gameArea.clientHeight - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth);
    const x = Math.random() * (areaWidth - btnWidth);
    const y = Math.random() * (areaHeight - btnHeight);
    return { x, y };
}

function createTarget() {
    if (targetBtn) targetBtn.remove();
    if (lizardTimeout) clearTimeout(lizardTimeout);
    targetBtn = document.createElement('button');
    targetBtn.id = 'targetBtn';
    targetBtn.textContent = '🦎';
    const pos = randomPosition();
    targetBtn.style.left = pos.x + 'px';
    targetBtn.style.top = pos.y + 'px';
    targetBtn.onclick = () => {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        if (clickSound) {
            try {
                clickSound.currentTime = 0;
                clickSound.play();
            } catch (e) {}
        }
        createTarget();
    };
    gameArea.appendChild(targetBtn);
    lizardTimeout = setTimeout(() => {
        endGame();
    }, 1500);
}

function startGame() {
    score = 0;
    currentTime = 0;
    scoreDisplay.textContent = 'Score: 0';
    timerDisplay.textContent = 'Time: 0.0';
    startBtn.disabled = true;
    createTarget();
    timerInterval = setInterval(() => {
        currentTime += 0.1;
        timerDisplay.textContent = 'Time: ' + currentTime.toFixed(1);
    }, 100);
}

function showModal(message) {
    const modal = document.getElementById('gameModal');
    const modalMsg = document.getElementById('modalMessage');
    const closeBtn = document.getElementById('closeModal');
    modalMsg.innerHTML = message;
    modal.style.display = 'block';
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function endGame() {
    clearInterval(timerInterval);
    if (lizardTimeout) clearTimeout(lizardTimeout);
    if (targetBtn) targetBtn.remove();
    startBtn.disabled = false;
    if (score > highScore) {
        highScore = score;
        saveHighScore(highScore);
        highScoreDisplay.textContent = 'High Score: ' + highScore;
    }
    showModal('Game Over!<br>Your score: <b>' + score + '</b><br>Time: <b>' + currentTime.toFixed(1) + '</b> seconds');
}

// Initialize everything after DOM is loaded
window.onload = function() {
    gameArea = document.getElementById('gameArea');
    startBtn = document.getElementById('startBtn');
    scoreDisplay = document.getElementById('score');
    highScoreDisplay = document.getElementById('highScore');
    timerDisplay = document.getElementById('timer');
    clickSound = document.getElementById('clickSound');
    loadHighScore();
    startBtn.onclick = startGame;
};
