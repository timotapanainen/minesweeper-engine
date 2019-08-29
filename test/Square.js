const Square = require('../src/Square');
const expect = require('chai').expect;

describe('Square', function () {

    describe('#constructor', function () {
        it('should create a square that is empty and unrevealed', function () {
            let square = new Square();
            expect(square.isEmpty()).to.be.true;
            expect(square.isRevealed()).to.be.false;
            expect(square.isFlagged()).to.be.false;
        });
    });

    describe('#reveal', function () {
        it('should fail when revealing flagged square', function () {
            let square = new Square();
            square.flag();
            expect(square.reveal).to.throw();
        });
        it('should reveal unrevealed square', function () {
            let square = new Square();
            square.reveal();
            expect(square.isRevealed()).to.be.true;
        });
    });
});

