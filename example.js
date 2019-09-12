const {Minesweeper, Difficulty, SquareState} = require('.');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function playGame() {
    console.log('Welcome to Minesweeper!');
    askDifficultyUntilOk()
        .then(difficulty => new Minesweeper(Difficulty.valueOf(difficulty)))
        .then((game) => playRound(game))
        .catch(err => console.log(err));
}

function askDifficultyUntilOk() {
    return askDifficulty().catch((reason) => {
        console.log(reason.message);
        return askDifficultyUntilOk();
    });
}

function askDifficulty() {
    return new Promise((resolve, reject) => {
        readline.question(
            'Select one of the following difficulty levels (beginner, intermediate, expert):',
            (input) => {
                if (['beginner', 'intermediate', 'expert'].includes(input))
                    resolve(input);
                else
                    reject(new Error(`unknown difficulty level: ${input}`))
            }
        );
    });
}

function playRound(game) {
    askCoordinateToReveal(game)
        .then(c => {
            game.revealSquareAt(c);
            if (!game.isEnded())
                return playRound(game);
            else {
                printBoard(game);
                if (game.isCleared())
                    console.log('Congratulations, you have cleared the minefield!!');
                else
                    console.log('Unfortunately you were blown up!');
                process.exit(0);
            }
        }).catch(err => {
        console.log(err.message);
        playRound(game);
    });
}

function askCoordinateToReveal(game) {
    printBoard(game);
    return new Promise((resolve, reject) => {
        readline.question(
            `Which square to reveal (x,y)?:`,
            (xy) => {
                let [x, y] = xy.split(',');
                resolve({x: parseInt(x), y: parseInt(y)});
            });
    });
}

function printBoard(game) {
    console.log(game.toString());
}

playGame();