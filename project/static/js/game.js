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
    const nextRound = document.getElementById("next-round");
    const newGame = document.getElementById("new-game");

    function answerAiHandler() {
        // if total > index, round has already been answered
        // so button must do nothing
        if (gameState.index === gameState.total) {
            gameState.total += 1;
            // Add +1 to score if answer is correct
            if (!gameState.data[gameState.index].isReal) {
                gameState.score += 1;
            }
            updateScore()
        }
    }
    answerAI.onclick = answerAiHandler;

    function answerPersonHandler() {
        // if total > index, round has already been answered
        // so button must do nothing
        if (gameState.index === gameState.total) {
            gameState.total += 1;
            // Add +1 to score if answer is correct
            if (gameState.data[gameState.index].isReal) {
                gameState.score += 1;
            }
            updateScore()
        }
    }
    answerPerson.onclick = answerPersonHandler;

    function nextRoundHandler() {
        if (gameState.index + 1 === gameState.total) {
            gameState.index += 1;
            updateView()
        }

    }
    nextRound.onclick = nextRoundHandler;
    newGame.onclick = startGame;
}

function updateScore() {
    const score = document.getElementById("score");
    score.innerHTML = gameState.score;
    const total = document.getElementById("total");
    total.innerHTML = gameState.total;
}

function updateView() {
    const imageView = document.getElementById("image-view")
    imageView.src = gameState.data[gameState.index].src
}

setupGame()
startGame()