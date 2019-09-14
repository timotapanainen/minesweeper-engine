const {Minesweeper, Difficulty, SquareState} = require('.');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

async function playGame() {
    console.log('Welcome to Minesweeper!');
    let difficulty = await askInput('Type difficulty level [beginner, intermediate, expert]:');
    let game = new Minesweeper(Difficulty.valueOf(difficulty));
    while (!game.isEnded()) {
        printBoard(game);
        let coordinate = await askCoordinateToReveal();
        game.revealSquareAt(coordinate);
    }
    printBoard(game);
    if (game.isCleared())
        console.log('Congratulations, you have cleared the minefield!!');
    else
        console.log('Unfortunately you were blown up!');
    process.exit(0);
}

async function askCoordinateToReveal() {
    let xy = await askInput('Type coordinate to reveal [x,y]?:');
    let [x, y] = xy.split(',');
    return {x: parseInt(x), y: parseInt(y)};
}

function askInput(question) {
    return new Promise((resolve, reject) => {
        readline.question(question, (input) => resolve(input));
    })
}

function printBoard(game) {
    console.log(game.toString());
}

playGame();