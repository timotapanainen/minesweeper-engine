
const util = require('./Util');

module.exports = class Coordinate {

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }

    toString() {
        return `(${this.x},${this.y})`
    }

    static random(limitX, limitY) {
        return new Coordinate(util.randomInt(limitX), util.randomInt(limitY));
    }
};