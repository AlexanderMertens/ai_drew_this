DEBUG = false; // set to false to disable debugging
old_console_log = console.log;
console.log = function() {
    if ( DEBUG ) {
        old_console_log.apply(this, arguments);
    }
}

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
    resetNextButton();
    updateScore();
    createNewImage();
    loadNextView();
}

function reset(state) {
    /**
     * Reset state to begin game anew.
     */
    state.index = 0;
    state.score = 0;
    state.total = 0;
    state.data = [];
}

function setupGame() {
    /**
     * Add all onclick listeners for buttons in the game.
     */
    const answerAI = document.getElementById("answer-ai");
    const aiContainer = document.getElementById("ai-container");
    const answerPerson = document.getElementById("answer-person");
    const personContainer = document.getElementById("person-container");
    const nextButton = document.getElementById("next");

    function answerButtonHandler(answerButton, otherAnswer, correctAnswer, container) {
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
                addMessage(container, true);
            } else {
                updateButtonsIncorrect(answerButton, otherAnswer);
                addMessage(container, false);
            }
            updateScore();
            setNextButtonActive();
            checkForEndOfGame();
        }
    }
    answerAI.onclick = () => answerButtonHandler(answerAI, answerPerson, false, aiContainer);
    answerPerson.onclick = () => answerButtonHandler(answerPerson, answerAI, true, personContainer);

    function nextButtonHandler() {
        console.log("Press next")
        if (gameState.total === gameState.data.length) {
            removeMessage();
            clearView();
            startGame();
            resetButtons(answerAI, answerPerson);;
            setNextButtonInactive();
            return;
        }

        if (gameState.index + 1 === gameState.total) {
            gameState.index += 1;
            resetButtons(answerAI, answerPerson);
            setNextButtonInactive();
            removeMessage();
            updateView();
            loadNextView();
        }
    }
    nextButton.onclick = nextButtonHandler;
}

function clearView() {
    const imageView = document.getElementById("image-view");
    imageView.remove();
}

function createNewImage() {
    const view = document.getElementById("view");
    const newImage = document.createElement("img");
    newImage.src = gameState.data[gameState.index].src;
    newImage.className = "game-image";
    newImage.id = "image-view";
    view.appendChild(newImage);
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

function loadNextView() {
    /**
     * Preload next image to view.
     */
    if (gameState.index + 1 < gameState.data.length) {
        const view = document.getElementById("view");
        const newImage = document.createElement("img");
        newImage.src = gameState.data[gameState.index + 1].src;
        newImage.className = "game-image hidden";
        newImage.id = "next-image-view";
        view.appendChild(newImage);
    }
}

function updateView() {
    /**
     * Update source of image.
     */
    const imageView = document.getElementById("image-view");
    const nextImage = document.getElementById("next-image-view");
    if (nextImage) {
        imageView.remove();
        nextImage.id = "image-view";
        nextImage.className = "game-image";
    } else {
        imageView.src = gameState.data[gameState.index].src;
    }
}

function checkForEndOfGame() {
    const next = document.getElementById("next");
    if (gameState.index === gameState.data.length - 1) {
        addVictoryMessage();
        next.innerHTML = "New Game";
    } 
}

function resetNextButton() {
    const next = document.getElementById("next");
    removeVictoryMessage();
    next.innerHTML = "Next";
}

function setNextButtonActive() {
    /**
     * Remove inactive from class of next button.
     */
    const next = document.getElementById("next");
    next.className = "next-button";
}

function setNextButtonInactive() {
    /**
     * Add inactive class to next button.
     */
    const next = document.getElementById("next");
    next.className += " inactive";
}

function addMessage(container, correct) {
    const message = document.createElement("div");
    message.innerHTML = correct ? "Correct!" : "Wrong!";
    message.className = `message ${correct ? "correct" : "incorrect"}`;
    message.id = "message";
    container.appendChild(message);
}

function removeMessage() {
    const message = document.getElementById("message");
    message?.remove();
}

function addVictoryMessage() {
    const container = document.getElementById("score-container");
    const message = document.createElement("div");
    const score = gameState.score / gameState.total;
    message.id = "victory-message";
    message.className = `victory-message ${score >= 0.5 ? "green" : "red"}`;
    if (score <= 0.45) {
        message.innerHTML = "Ouch!";
    } else if (score <= 0.55) {
        message.innerHTML = "Not great!";
    } else if (score <= 0.75) {
        message.innerHTML = "Not bad!";
    } else if (score <= 0.95) {
        message.innerHTML = "Good job!";
    } else {
        message.innerHTML = "Congrats!";
    }
    container.appendChild(message);
}

function removeVictoryMessage() {
    const message = document.getElementById("victory-message");
    message?.remove();
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