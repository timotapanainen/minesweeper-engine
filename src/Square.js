class Square {

    constructor() {
        this.value = Square.Value.Empty;
        this.state = Square.State.Unrevealed;
    }

    layMine() {
        this.value = Square.Value.Mine;
    }

    reveal() {
        if (this.isFlagged())
            throw new Error('cannot reveal flagged square');
        if (this.isRevealed())
            throw new Error('square is already revealed');
        this.state = Square.State.Revealed;
    }

    flag() {
        if (this.isFlagged())
            throw new Error('square is already flagged');
        if (this.isRevealed())
            throw new Error('cannot flag revealed square');
        this.state = Square.State.Flagged;
    }

    unflag() {
        if (!this.isFlagged())
            throw new Error('square is not flagged');
        this.state = Square.State.Unrevealed;
    }

    isMined() {
        return this.value === Square.Value.Mine;
    }

    isEmpty() {
        return this.value === Square.Value.Empty;
    }

    isFlagged() {
        return this.state === Square.State.Flagged;
    }

    isRevealed() {
        return this.state === Square.State.Revealed;
    }

    incNeighboringMineCount() {
        this.value = this.value + 1;
    }

    toString() {
        switch (this.state) {
            case Square.State.Flagged:
                return 'f';
            case Square.State.Unrevealed:
                return '#';
            case Square.State.Revealed:
                return this.valueToString();
        }
    }

    valueToString() {
        switch (this.value) {
            case Square.Value.Mine:
                return 'x';
            case Square.Value.Empty:
                return ' ';
            default:
                return '' + this.value;
        }
    }
}

Square.State = {Flagged: 2, Unrevealed: 1, Revealed: 0};
Square.Value = {Mine: 9, Empty: 0};

module.exports = Square;