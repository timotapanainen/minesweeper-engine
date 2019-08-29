const Coordinate = require('./Coordinate');
const Square = require('./Square');

module.exports = class Minefield {

    constructor({width, height, mines = 0}, excludeCoordinate) {
        this._width = width;
        this._height = height;
        this._minesLaid = 0;
        this._revealedSquares = 0;
        this._squares = Array(width).fill().map(() => Array(height).fill().map(() => new Square()));
        if (mines > 0)
            this.layMinesRandomly(mines, excludeCoordinate);
    }

    /**
     * Lays specified amount of mines random locations except the specified coordinate if given.
     * Throws an error if trying to plan more than (w * h -1) mines
     *
     * @param desiredMineCount mines to plant
     * @param excludeCoordinate coordinate where not to put a mine
     * @private
     */
    layMinesRandomly(desiredMineCount, excludeCoordinate) {
        if (desiredMineCount > (this._width * this._height - 1))    // at least one square should be without a mine
            throw new Error('not enough squares to plant all the desired mines');
        while (this._minesLaid < desiredMineCount) {
            const candidateCoordinate = Coordinate.random(this._width, this._height);
            if (!excludeCoordinate || !candidateCoordinate.equals(excludeCoordinate)) {
                const candidateSquare = this.squareAt(candidateCoordinate);
                if (!candidateSquare.isMined()) {
                    this._layMine(candidateCoordinate);
                }
            }
        }
    }

    /**
     * Lays a mine to the specified location and increments value in unmined neighboring squares.
     * Throws an error if the target location is already mined.
     *
     * @param coordinate location where to lay a mine
     * @private
     */
    _layMine(coordinate) {
        let targetSquare = this.squareAt(coordinate);
        if (targetSquare.isMined())
            throw new Error(`coordinate ${coordinate} is already mined`);
        else {
            targetSquare.layMine();
            for (let neighborCoordinate of this._neighbors(coordinate)) {
                let neighborSquare = this.squareAt(neighborCoordinate);
                if (!neighborSquare.isMined())
                    neighborSquare.incNeighboringMineCount();
            }
            ++this._minesLaid;
        }
    }

    /**
     * Returns neighboring coordinates of the specified coordinate.
     *
     * @param coordinate
     * @returns {IterableIterator<Coordinate|*>}
     * @private
     */
    * _neighbors(coordinate) {
        let candidate;
        for (let x = Math.max(coordinate.x - 1, 0); x < Math.min(coordinate.x + 2, this._width); ++x) {
            for (let y = Math.max(coordinate.y - 1, 0); y < Math.min(coordinate.y + 2, this._height); ++y) {
                candidate = new Coordinate(x, y);
                if (!candidate.equals(coordinate))
                    yield candidate;
            }
        }
    }

    /**
     *
     * @param coordinate
     */
    reveal(coordinate) {
        this.validateCoordinate(coordinate);
        let targetSquare = this.squareAt(coordinate);
        if (targetSquare.isFlagged())
            throw new Error('cannot reveal flagged square');
        if (targetSquare.isRevealed())
            throw new Error('square is already revealed');
        let visited = [];
        this._reveal(coordinate, visited);
        return visited;
    }

    _reveal(coordinate, visited) {
        let square = this.squareAt(coordinate);
        if (!square.isRevealed() && !square.isFlagged()) {
            square.reveal();
            ++this._revealedSquares;
            visited.push(coordinate);
            if (square.isEmpty()) {
                for (let neighbor of this._neighbors(coordinate))
                    this._reveal(neighbor, visited);
            }
        }
    }

    flag(coordinate) {
        this.validateCoordinate(coordinate);
        this.squareAt(coordinate).flag();
    }

    unflag(coordinate) {
        this.validateCoordinate(coordinate);
        this.squareAt(coordinate).unflag();
    }

    squareAt(coordinate) {
        return this._squares[coordinate.x][coordinate.y];
    }

    isAllRevealed() {
        return this._revealedSquares + this._minesLaid === this._width * this._height;
    }

    isMined(coordinate) {
        return this.squareAt(coordinate).isMined();
    }

    validateCoordinate({x, y}) {
        let isValid = (0 <= x && x < this._width && 0 <= y && y < this._height);
        if (!isValid)
            throw new Error(`coordinate ${coordinate} out of minefield bounds`);
    }

    squareValuesToString() {
        let s = '';
        for (let x = 0; x < this._width; ++x) {
            for (let y = 0; y < this._height; ++y) {
                s += this._squares[x][y].value + ' ';
            }
            s += '\n';
        }
        return s;
    }

    toString() {
        let s = '';
        for (let y = -1; y < this._height; ++y) {
            for (let x = -1; x < this._width; ++x) {
                if (y === -1 && x === -1) // top left corner
                    s += '  ';
                else if (y === -1 && x !== -1)  // col index generation
                    s += x % 10 + ' ';
                else if (x === -1 && y !== -1)  // row index generation
                    s += y % 10 + ' ';
                else
                    s += this._squares[x][y].toString() + ' ';
            }
            s += '\n';
        }
        return s;
    }

};

