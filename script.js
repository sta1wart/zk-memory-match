document.addEventListener('DOMContentLoaded', function() {
    // ===== Login Modal Functionality =====
    const loginModal = document.getElementById('login-modal');
    const loginButton = document.getElementById('login-button');
    const nicknameInput = document.getElementById('nickname-input');

    // Глобальна змінна для збереження нікнейму
    let userNickname = '';

    loginButton.addEventListener('click', function() {
        const nickname = nicknameInput.value.trim();
        if (nickname === '') {
            alert('Please enter your nickname');
        } else {
            userNickname = nickname;
            loginModal.style.display = 'none';
        }
    });

    // ===== Головний код гри =====
    const gameBoard = document.getElementById('game-board');
    const cardsData = [
        '0', '2', '1', '3-3', '1-1', '4', '4-4', '5-5',
        '6', '23', '8', '22', '1212212', '21212212', '123453', '2131231'
    ];
    const lockIcon = 'images/safe.png';
    const backgroundMusic = document.getElementById('backgroundMusic');

    let cards = [];
    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let gameVisible = false;
    let gameStarted = false;
    let sfxVolume = 0.5; // за замовчуванням 50%

    // ===== Функції для звуків =====
    function playCardSound() {
        const sound = new Audio('images/card.mp3');
        sound.volume = sfxVolume;
        sound.play().catch(error => console.error("Card sound playback failed:", error));
    }

    function playButtonSound() {
        const sound = new Audio('images/button.mp3');
        sound.volume = sfxVolume;
        sound.play().catch(error => console.error("Button sound playback failed:", error));
    }

    // ===== Функція перемішування =====
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // ===== Функція створення картки =====
    function createCard(cardData) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardData;
        card.dataset.flipped = 'false';

        const img = document.createElement('img');
        img.dataset.originalSrc = `images/${cardData}.png`;
        img.alt = cardData;
        img.src = lockIcon;
        card.appendChild(img);

        card.addEventListener('click', flipCard);
        img.ondragstart = () => false;

        return card;
    }

    // ===== Функція перевертання картки =====
    function flipCard() {
        if (flippedCards.length < 2 && this.dataset.flipped === 'false' && !matchedCards.includes(this)) {
            playCardSound();
            this.classList.add('flipped');
            this.dataset.flipped = 'true';
            flippedCards.push(this);
            this.querySelector('img').src = this.querySelector('img').dataset.originalSrc;
            if (flippedCards.length === 2) {
                moves++;
                setTimeout(checkForMatch, 500);
                updateMovesCount();
            }
        }
    }

    // ===== Оновлення лічильника ходів =====
    function updateMovesCount() {
        const movesCountElement = document.getElementById('moves-count');
        if (movesCountElement) {
            movesCountElement.textContent = 'Moves: ' + moves;
        }
    }

    // ===== Функція перевірки збігу =====
    function checkForMatch() {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];

        if ((card1.dataset.value === '0' && card2.dataset.value === '2') ||
            (card1.dataset.value === '2' && card2.dataset.value === '0') ||
            (card1.dataset.value === '1' && card2.dataset.value === '3-3') ||
            (card1.dataset.value === '3-3' && card2.dataset.value === '1') ||
            (card1.dataset.value === '1-1' && card2.dataset.value === '4') ||
            (card1.dataset.value === '4' && card2.dataset.value === '1-1') ||
            (card1.dataset.value === '4-4' && card2.dataset.value === '5-5') ||
            (card1.dataset.value === '5-5' && card2.dataset.value === '4-4') ||
            (card1.dataset.value === '6' && card2.dataset.value === '23') ||
            (card1.dataset.value === '23' && card2.dataset.value === '6') ||
            (card1.dataset.value === '8' && card2.dataset.value === '22') ||
            (card1.dataset.value === '22' && card2.dataset.value === '8') ||
            (card1.dataset.value === '1212212' && card2.dataset.value === '21212212') ||
            (card1.dataset.value === '21212212' && card2.dataset.value === '1212212') ||
            (card1.dataset.value === '123453' && card2.dataset.value === '2131231') ||
            (card1.dataset.value === '2131231' && card2.dataset.value === '123453')) {
            matchedCards.push(card1, card2);
            card1.removeEventListener('click', flipCard);
            card2.removeEventListener('click', flipCard);
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.dataset.flipped = 'false';
            card2.dataset.flipped = 'false';
            card1.querySelector('img').src = lockIcon;
            card2.querySelector('img').src = lockIcon;
        }
        flippedCards = [];
        if (matchedCards.length === cardsData.length) {
            showGameOverModal();
        }
    }

    // ===== Функція налаштування гри =====
    function setupGame() {
        shuffle(cardsData);
        cards = [];
        gameBoard.innerHTML = '';
        moves = 0;
        flippedCards = [];
        matchedCards = [];
        for (let i = 0; i < cardsData.length; i++) {
            const card = createCard(cardsData[i]);
            cards.push(card);
            gameBoard.appendChild(card);
        }
    }

    // ===== Модальне вікно гри =====
    function showGameModal() {
        const gameModal = document.getElementById('game-modal');
        gameModal.style.display = 'block';
        document.getElementById('start-game-button').style.display = 'inline-block';
        document.getElementById('restart-button').style.display = 'none';
        gameBoard.innerHTML = '';
        moves = 0;
    }

    function startGame() {
        playButtonSound();
        gameStarted = true;
        gameVisible = true;
        const gameModal = document.getElementById('game-modal');
        gameModal.style.display = 'block';
        setupGame();
        backgroundMusic.play().catch(error => {
            console.error("Autoplay prevented:", error);
            alert("Background music cannot play automatically. Please enable sound.");
        });
        document.getElementById('start-game-button').style.display = 'none';
        document.getElementById('restart-button').style.display = 'inline-block';
        updateMovesCount();
        document.getElementById('moves-count').style.display = 'block';
    }

    function restartGame() {
        playButtonSound();
        setupGame();
        matchedCards = [];
        flippedCards = [];
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
        moves = 0;
        updateMovesCount();
        // При рестарті приховуємо вікно перемоги (якщо було відкрито)
        document.getElementById('victory-modal').style.display = 'none';
    }

    // ===== Toggle Game Visibility (Minimize/Restore) =====
    function toggleGameVisibility() {
        const gameModal = document.getElementById('game-modal');
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        const leaderboardOverlay = document.getElementById('leaderboard-overlay');
        const victoryModal = document.getElementById('victory-modal');
        playButtonSound();
        if (gameVisible) {
            gameModal.style.display = 'none';
            gameVisible = false;
            if (tutorialOverlay) tutorialOverlay.style.display = 'none';
            if (leaderboardOverlay) leaderboardOverlay.style.display = 'none';
            if (victoryModal) victoryModal.style.display = 'none';
        } else {
            gameModal.style.display = 'block';
            gameVisible = true;
        }
    }

    // ===== Функція фіналу гри (Victory) з Firestore інтеграцією =====
    function showGameOverModal() {
        playButtonSound();
        // Відтворюємо музичний сигнал magic.mp3
        const victorySound = new Audio('images/magic.mp3');
        victorySound.play().catch(error => console.error("Victory sound playback failed:", error));

        // Зберігаємо лише найкращий результат для поточного користувача
        if (userNickname) {
            db.collection("leaderboard").where("name", "==", userNickname).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    // Запис відсутній – додаємо новий
                    return db.collection("leaderboard").add({
                        name: userNickname,
                        moves: moves,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    // Запис існує – оновлюємо лише, якщо новий результат кращий (менше ходів)
                    let updatePromises = [];
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        if (moves < data.moves) {
                            updatePromises.push(doc.ref.update({
                                moves: moves,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp()
                            }));
                        }
                    });
                    if (updatePromises.length === 0) {
                        return Promise.resolve();
                    }
                    return Promise.all(updatePromises);
                }
            })
            .then(() => {
                console.log("Result saved/updated in Firestore!");
                updateLeaderboardUI();
            })
            .catch(error => {
                console.error("Error saving/updating result: ", error);
            });
        }

        // Показуємо вікно перемоги
        document.getElementById('victory-modal').style.display = 'block';
    }

    // ===== Функція оновлення лідерборду (читання з Firestore) =====
    function updateLeaderboardUI() {
        const leaderboardRows = document.getElementById('leaderboard-rows');
        db.collection("leaderboard")
          .orderBy("moves", "asc")
          .get()
          .then(snapshot => {
              leaderboardRows.innerHTML = '';
              let rank = 1;
              snapshot.forEach(doc => {
                  const data = doc.data();
                  const rowDiv = document.createElement("div");
                  rowDiv.classList.add("leaderboard-row");

                  const rankSpan = document.createElement("span");
                  rankSpan.classList.add("leaderboard-rank");
                  rankSpan.textContent = `#${rank}`;

                  const nameSpan = document.createElement("span");
                  nameSpan.classList.add("leaderboard-name");
                  nameSpan.textContent = data.name;

                  const movesSpan = document.createElement("span");
                  movesSpan.classList.add("leaderboard-moves");
                  movesSpan.textContent = data.moves;

                  rowDiv.appendChild(rankSpan);
                  rowDiv.appendChild(nameSpan);
                  rowDiv.appendChild(movesSpan);

                  leaderboardRows.appendChild(rowDiv);
                  rank++;
              });
          })
          .catch(error => {
              console.error("Error retrieving leaderboard: ", error);
          });
    }

    // ===== Функція показу лідерборду =====
    function showLeaderboardOverlay() {
        const leaderboardOverlay = document.getElementById('leaderboard-overlay');
        updateLeaderboardUI();
        leaderboardOverlay.classList.remove('hidden');
        leaderboardOverlay.style.display = 'block';
    }

    // Додаємо обробку події для закриття лідерборду при кліку на overlay
    const leaderboardOverlay = document.getElementById('leaderboard-overlay');
    leaderboardOverlay.addEventListener('click', function(e) {
        if (e.target === leaderboardOverlay) {
            leaderboardOverlay.style.display = 'none';
        }
    });

    // ===== Обробка подій для кнопок =====
    const gameIcon = document.getElementById('start-icon');
    gameIcon.addEventListener('click', function () {
        playButtonSound();
        if (!gameStarted) {
            showGameModal();
        } else {
            toggleGameVisibility();
        }
    });

    document.getElementById('start-game-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    document.getElementById('leaderboard-button').addEventListener('click', function () {
        playButtonSound();
        showLeaderboardOverlay();
    });
    document.getElementById('tutorial-button').addEventListener('click', function() {
        playButtonSound();
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        tutorialOverlay.style.display = 'block';
        const tutorialWindow = document.getElementById('tutorial-window');
        if (tutorialWindow) {
            tutorialWindow.scrollTop = 0;
        }
    });

    // Обробка події для кнопки "Play Again" у вікні перемоги
    const playAgainButton = document.getElementById('play-again-button');
    if (playAgainButton) {
        playAgainButton.addEventListener('click', function() {
            restartGame();
            document.getElementById('victory-modal').style.display = 'none';
        });
    }

    // Закриття туторіалу при кліку по overlay (сірій області)
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    tutorialOverlay.addEventListener('click', function(e) {
        if (e.target === tutorialOverlay) {
            tutorialOverlay.style.display = 'none';
        }
    });

    document.getElementById('close-game-modal').addEventListener('click', function () {
        playButtonSound();
        const gameModal = document.getElementById('game-modal');
        gameModal.style.display = 'none';
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        gameStarted = false;
        gameVisible = false;
        gameBoard.innerHTML = '';
        moves = 0;
        document.getElementById('start-game-button').style.display = 'inline-block';
        document.getElementById('restart-button').style.display = 'none';

        // Закриваємо туторіал, якщо він був відкритий
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        if (tutorialOverlay) {
            tutorialOverlay.style.display = 'none';
            const tutorialWindow = document.getElementById('tutorial-window');
            if (tutorialWindow) {
                tutorialWindow.scrollTop = 0;
            }
        }
        // Закриваємо вікно перемоги, якщо відкрите
        document.getElementById('victory-modal').style.display = 'none';
    });

    // ===== Функції для роботи з повзунками музики та SFX =====
    function toggleVolumeSlider() {
        const soundSliders = document.getElementById('sound-sliders');
        if (soundSliders.style.display === 'none' || soundSliders.style.display === '') {
            soundSliders.style.display = 'flex';
        } else {
            soundSliders.style.display = 'none';
        }
    }

    document.getElementById('volume-icon').addEventListener('click', function(e) {
        e.stopPropagation();
        playButtonSound();
        toggleVolumeSlider();
    });

    const volumeRange = document.querySelector('.volume-range');
    volumeRange.addEventListener('input', function () {
        const volume = this.value / 100;
        setGameVolume(volume);
    });

    function setGameVolume(volume) {
        const volumePercentageValue = document.getElementById('volume-percentage-value');
        const percentage = Math.round(volume * 100);
        volumePercentageValue.textContent = percentage + "%";
        backgroundMusic.volume = volume;
    }

    setGameVolume(0.5);
    volumeRange.value = 50;

    document.addEventListener('click', function (event) {
        const soundSliders = document.getElementById('sound-sliders');
        const volumeIcon = document.getElementById('volume-icon');
        if (!soundSliders.contains(event.target) && !volumeIcon.contains(event.target) && soundSliders.style.display !== 'none') {
            soundSliders.style.display = 'none';
        }
    });

    volumeRange.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    const sfxVolumeRange = document.querySelector('.sfx-volume-range');
    sfxVolumeRange.addEventListener('input', function () {
        const volume = this.value / 100;
        setSfxVolume(volume);
    });

    function setSfxVolume(volume) {
        sfxVolume = volume;
        const sfxVolumePercentageValue = document.getElementById('sfx-volume-percentage-value');
        const percentage = Math.round(volume * 100);
        sfxVolumePercentageValue.textContent = percentage + "%";
    }

    setSfxVolume(0.5);
    sfxVolumeRange.value = 50;

    document.addEventListener('click', function (event) {
        const soundSliders = document.getElementById('sound-sliders');
        const volumeIcon = document.getElementById('volume-icon');
        if (!soundSliders.contains(event.target) && !volumeIcon.contains(event.target) && soundSliders.style.display !== 'none') {
            soundSliders.style.display = 'none';
        }
    });

    sfxVolumeRange.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    const startGameButton = document.getElementById('start-game-button');
    const leaderboardButton = document.getElementById('leaderboard-button');
    const tutorialButton = document.getElementById('tutorial-button');
    const movesCountElement = document.getElementById('moves-count');

    startGameButton.addEventListener('click', function() {
        leaderboardButton.style.display = 'block';
        tutorialButton.style.display = 'block';
        movesCountElement.style.display = 'block';
    });

    document.getElementById('close-game-modal').addEventListener('click', function() {
        leaderboardButton.style.display = 'none';
        tutorialButton.style.display = 'none';
        movesCountElement.style.display = 'none';
        document.getElementById('restart-button').style.display = 'none';
    });

    startGameButton.addEventListener('click', function() {
        leaderboardButton.style.display = 'block';
        tutorialButton.style.display = 'block';
    });
});
