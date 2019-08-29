
const {Minesweeper, Difficulty, SquareState} = require('.');
let ms;

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Welcome to Minesweeper!');

askDifficulty((difficultyName) =>  {
    ms = new Minesweeper(Difficulty.valueOf(difficultyName));
    askCoordinateToReveal(function revealHandler(x, y) {
        ms.revealSquareAt({x: parseInt(x), y: parseInt(y)});
        if (ms.isEnded()) {
            printMinefield();
            process.exit(0);
        } else
            askCoordinateToReveal(revealHandler);
    });
});

function askDifficulty(callback) {
    readline.question(`Select one of the following difficulty levels (beginner, intermediate, expert):`, callback);
}

function printMinefield() {
    console.log(ms.toString());
}

function askCoordinateToReveal(callback) {
    printMinefield();
    readline.question(`Specify square to reveal (x,y):`, (xy) => {
        let [x,y] = xy.split(',');
        callback(parseInt(x), parseInt(y));
    });
}