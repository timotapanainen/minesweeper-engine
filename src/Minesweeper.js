
const Timer = require('./Timer');
const Minefield = require('./Minefield');

class Minesweeper {

    constructor(difficulty) {
        this._difficulty = difficulty;
        this._timer = new Timer();
        this._state = Minesweeper.State.Ready;
        this._minefield = new Minefield({width: difficulty.width, height: difficulty.height});
    }

    get difficulty() {
        return this._difficulty;
    }

    duration() {
        return this._timer.duration();
    }

    isReady() {
        return this._state === Minesweeper.State.Ready;
    }

    isInProgress() {
        return this._state === Minesweeper.State.InProgress;
    }

    isEnded() {
        return this._state === Minesweeper.State.Cleared ||
            this._state === Minesweeper.State.Failed;
    }

    isCleared() {
        return this._state === Minesweeper.State.Cleared;
    }

    isFailed() {
        return this._state === Minesweeper.State.Failed;
    }

    /**
     * Returns state and value of the specified square
     * @param coordinate
     */
    getSquareAt(coordinate) {
        return this._minefield.squareAt(coordinate);
    }

    /**
     * Reveals the specified square and returns coordinate of the revealed square or squares in case the square was empty.
     * @param coordinate
     */
    revealSquareAt(coordinate) {
        switch (this._state) {
            case Minesweeper.State.Ready:
                this._start(coordinate);
            case Minesweeper.State.InProgress:
                return this._revealSquareAt(coordinate);
            case Minesweeper.State.Cleared:
            case Minesweeper.State.Failed:
                throw new Error('invalid action, the game has ended already ended');
        }
    }

    flagSquareAt(coordinate) {
        if (!this.isInProgress())
            throw new Error('cannot flag while the game is not in progress');
        this._minefield.flag(coordinate);
    }

    unflagSquareAt(coordinate) {
        if (!this.isInProgress())
            throw new Error('cannot flag while the game is not in progress');
        this._minefield.unflag(coordinate);
    }

    _start(coordinate) {
        this._minefield.layMinesRandomly(this.difficulty.mines, coordinate);
        this._timer.start();
        this._state = Minesweeper.State.InProgress;
    }

    _revealSquareAt(coordinate) {
        let revealedCoordinates = this._minefield.reveal(coordinate);
        if (this._minefield.isMined(coordinate)) {
            this._timer.stop();
            this._state = Minesweeper.State.Failed;
        } else if (this._minefield.isAllRevealed()) {
            this._timer.stop();
            this._state = Minesweeper.State.Cleared;
        }
        return revealedCoordinates;
    }

    toString() {
        return `Minesweeper: ${this._difficulty.toString()}, ${Object.getOwnPropertyNames(Minesweeper.State)[this._state]}, ${Math.floor(this.duration() / 1000)} sec
---------------------
${this._minefield.toString()}`
    }
}

Minesweeper.State = {Ready: 0, InProgress: 1, Cleared: 2, Failed: 3};

module.exports = Minesweeper;
