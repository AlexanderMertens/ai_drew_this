let gameState = {
    index: 0,
    score: 0,
    total: 0,
    data: []
}

function startGame() {
    fetch('/start-game')
    .then((response) => response.json()) 
    .then(runGame)
    .catch((err) => console.log(err));
}

function runGame(responseJSON) {
    /**
     * Loads JSON object into gameState.data.
     * Updates score and View to reflect new game.
     */
    reset(gameState);
    gameState.data = responseJSON;
    console.log("Game state:",gameState);
    updateScore();
    updateView();
}

function reset(state) {
    /**
     * Reset state to begin game anew.
     */
    state.index = 0;
    state.score = 0;
    state.total = 0;
}

function setupGame() {
    /**
     * Add all onclick listeners for buttons in the game.
     */
    const answerAI = document.getElementById("answer-ai");
    const answerPerson = document.getElementById("answer-person");
    const nextButton = document.getElementById("next");

    function answerButtonHandler(answerButton, otherAnswer, correctAnswer) {
        if (correctAnswer) {
            console.log("Press answer Person")
        } else {
            console.log("Press answer AI")
        }
        // if total > index, round has already been answered
        // so button must do nothing
        if (gameState.index === gameState.total) {
            gameState.total += 1;
            // Add +1 to score if answer is correct
            if (gameState.data[gameState.index].isReal === correctAnswer) {
                gameState.score += 1;
                updateButtonsCorrect(answerButton, otherAnswer);
            } else {
                updateButtonsIncorrect(answerButton, otherAnswer);
            }
            updateScore();
            setNextButtonActive();
        }
    }
    answerAI.onclick = () => answerButtonHandler(answerAI, answerPerson, false);
    answerPerson.onclick = () => answerButtonHandler(answerPerson, answerAI, true);

    function nextButtonHandler() {
        console.log("Press next")
        if (gameState.total === gameState.data.length) {
            startGame();
            resetButtons(answerAI, answerPerson);;
            setNextButtonInactive();
            return;
        }

        if (gameState.index + 1 === gameState.total) {
            gameState.index += 1;
            resetButtons(answerAI, answerPerson);
            setNextButtonInactive();
            updateView();
        }
    }
    nextButton.onclick = nextButtonHandler;
}

function updateScore() {
    /**
     * Update HTML to reflect gameState score.
     */
    const score = document.getElementById("score");
    score.innerHTML = gameState.score;
    const total = document.getElementById("total");
    total.innerHTML = gameState.total;
}

function updateView() {
    /**
     * Update source of image.
     */
    const imageView = document.getElementById("image-view");
    imageView.src = gameState.data[gameState.index].src;
}

function setNextButtonActive() {
    const next = document.getElementById("next");
    next.className = "next-button";
}

function setNextButtonInactive() {
    const next = document.getElementById("next");
    next.className += " inactive";
}

function updateButtonsCorrect(correctButton, otherButton) {
    correctButton.className += " correct";
    otherButton.className += " not-selected";
}

function updateButtonsIncorrect(incorrectButton, otherButton) {
    incorrectButton.className += " incorrect";
    otherButton.className += " not-selected";
}

function resetButtons(answerAI, answerPerson) {
    answerAI.className = "answer-button";
    answerPerson.className = "answer-button"
}

setupGame()
startGame()