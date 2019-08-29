const Coordinate = require('../src/Coordinate');
const Minesweeper = require('../src/Minesweeper');
const Difficulty = require('../src/Difficulty');

const sinon = require('sinon');
const expect = require('chai').expect;

let clock;
let randomCoordinateGenerator;

describe('Minesweeper', function () {

    beforeEach(function() {
        clock = sinon.useFakeTimers();
        randomCoordinateGenerator = sinon.stub(Coordinate, 'random');
    });

    afterEach(function() {
        clock.restore();
        randomCoordinateGenerator.restore();
    });

    describe('#revealSquare', function () {
        it('should start timer and change to inProgress state when first square is revealed', function () {
            // create minefield with the following layout
            // 0 0 0
            // 0 1 1
            // 0 1 x

            randomCoordinateGenerator.onCall(0).returns(new Coordinate(2, 2));

            let ms = new Minesweeper({width: 3, height: 3, mines: 1});

            // validate game state before it is started
            expect(ms.duration()).to.equal(0);
            expect(ms.isInProgress()).to.be.false;
            expect(ms.isEnded()).to.be.false;

            // reveal square at (1,1)
            let revealedCoordinates = ms.revealSquareAt(new Coordinate(1, 1));
            expect(revealedCoordinates).to.have.deep.members([new Coordinate(1, 1)]);
            clock.tick(20);

            expect(ms.duration()).to.equal(20);
            expect(ms.isInProgress()).to.be.true;
            expect(ms.isEnded()).to.be.false;

            let revealedSquare = ms.getSquareAt(revealedCoordinates[0]);
            expect(revealedSquare.isRevealed()).to.be.true;
            expect(revealedSquare.value).to.equal(1);

            // reveal square at (0,0) which causes all the remaining non-mined and hidden square to be revealed
            clock.tick(40);
            ms.revealSquareAt(new Coordinate(0,0));
            expect(ms.duration()).to.equal(60);
            expect(ms.isInProgress()).to.be.false;
            expect(ms.isEnded()).to.be.true;
            expect(ms.isCleared()).to.be.true;

            expect(() => ms.revealSquareAt(new Coordinate(1,0))).to.throw();
            expect(() => ms.flagSquareAt(new Coordinate(1,1))).to.throw();
        });

        it('should end unsuccessfully when mined square is revealed', function () {
            // minefield layout
            // 0 0 0
            // 0 1 1
            // 0 1 x

            randomCoordinateGenerator.onCall(0).returns(new Coordinate(2, 2));

            let ms = new Minesweeper({width: 3, height: 3, mines: 1});

            ms.revealSquareAt(new Coordinate(1, 1));
            ms.revealSquareAt(new Coordinate(2, 2));
            clock.tick(20);

            expect(ms.isInProgress()).to.be.false;
            expect(ms.isEnded()).to.be.true;
            expect(ms.isCleared()).to.be.false;

            // check that no more squares can be revealed or flagged since the game has ended
            expect(() => ms.revealSquareAt(new Coordinate(1,0))).to.throw();
            expect(() => ms.flagSquareAt(new Coordinate(1,1))).to.throw();
        });
    });
});

