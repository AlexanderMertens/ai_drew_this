async function startGame() {
    fetch('/start-game')
    .then((response) => response.json()) 
    .then(runGame)
    .catch((err) => console.log(err));
}

function runGame(gameData) {
    index = 0;
    console.log(gameData)
}

startGame()