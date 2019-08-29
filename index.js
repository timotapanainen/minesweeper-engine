const Minesweeper = require('./src/Minesweeper');
const Difficulty = require('./src/Difficulty');
const Square = require('./src/Square');

module.exports = {
    Minesweeper: Minesweeper,
    Difficulty: Difficulty,
    SquareState: Square.State,
    SquareValue: Square.Value
};