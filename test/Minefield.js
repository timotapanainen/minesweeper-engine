const Coordinate = require('../src/Coordinate');
const Minefield = require('../src/Minefield');
const Square = require('../src/Square');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Minefield', function () {

    describe('#neighbors', function () {
        it('should return neighbor coordinates (0,1), (1,0) and (1,1) of (0,0)', function () {
            const mf = new Minefield({width: 10, height: 10});
            const neighborsOf00 = mf._neighbors(new Coordinate(0, 0));
            expect(Array.from(neighborsOf00)).to.have.deep.members([
                new Coordinate(0, 1),
                new Coordinate(1, 0),
                new Coordinate(1, 1)
            ]);
        });
        it('should return neighbor coordinates (9,8), (8,9) and (8,8) of (9,9)', function () {
            const mf = new Minefield({width: 10, height: 10});
            const neighborsOf00 = mf._neighbors(new Coordinate(9, 9));
            expect(Array.from(neighborsOf00)).to.have.deep.members([
                new Coordinate(9, 8),
                new Coordinate(8, 9),
                new Coordinate(8, 8)
            ]);
        });
        it('should return neighbor coordinates of (2,2)', function () {
            const mf = new Minefield({width: 10, height: 10});
            const neighborsOf00 = mf._neighbors(new Coordinate(2, 2));
            expect(Array.from(neighborsOf00)).to.have.deep.members([
                new Coordinate(1, 1),
                new Coordinate(1, 2),
                new Coordinate(1, 3),
                new Coordinate(2, 1),
                new Coordinate(2, 3),
                new Coordinate(3, 1),
                new Coordinate(3, 2),
                new Coordinate(3, 3)
            ]);
        });
    });

    describe('#layMine', function () {
        it("lays mine to target coordinate and increment value in non-mined neighboring squares", function () {
            let mf = new Minefield({width: 10, height: 10, mines: 0});
            mf._layMine(new Coordinate(0, 0));
            expect(mf.squareAt(new Coordinate(0, 0)).value).to.equal(Square.Value.Mine);
            expect(mf.squareAt(new Coordinate(0, 1)).value).to.equal(1);
            expect(mf.squareAt(new Coordinate(1, 1)).value).to.equal(1);
            expect(mf.squareAt(new Coordinate(1, 0)).value).to.equal(1);
            expect(mf._minesLaid).to.equal(1);

            mf._layMine(new Coordinate(0, 1));
            expect(mf.squareAt(new Coordinate(0, 0)).value).to.equal(Square.Value.Mine);
            expect(mf.squareAt(new Coordinate(0, 1)).value).to.equal(Square.Value.Mine);
            expect(mf.squareAt(new Coordinate(0, 2)).value).to.equal(1);
            expect(mf.squareAt(new Coordinate(1, 0)).value).to.equal(2);
            expect(mf.squareAt(new Coordinate(1, 1)).value).to.equal(2);
            expect(mf.squareAt(new Coordinate(1, 2)).value).to.equal(1);
            expect(mf._minesLaid).to.equal(2);

        });
    });

    describe('#layMinesRandomly', function () {
        it("should lay mines to (0,0) and (1,1) and increments neighbors accordingly", function () {
            let stub = sinon.stub(Coordinate, 'random');
            stub.onCall(0).returns(new Coordinate(0, 0));
            stub.onCall(1).returns(new Coordinate(1, 1));

            let mf = new Minefield({width: 10, height: 10, mines: 2});

            expect(mf.squareAt(new Coordinate(0, 0)).value).to.equal(Square.Value.Mine);
            expect(mf.squareAt(new Coordinate(0, 1)).value).to.equal(2);
            expect(mf.squareAt(new Coordinate(0, 2)).value).to.equal(1);
            expect(mf.squareAt(new Coordinate(0, 3)).value).to.equal(0);
            expect(mf.squareAt(new Coordinate(1, 0)).value).to.equal(2);
            expect(mf.squareAt(new Coordinate(1, 1)).value).to.equal(Square.Value.Mine);
            expect(mf.squareAt(new Coordinate(1, 2)).value).to.equal(1);
            expect(mf.squareAt(new Coordinate(1, 3)).value).to.equal(0);
            expect(mf.squareAt(new Coordinate(2, 0)).value).to.equal(1);
            expect(mf.squareAt(new Coordinate(2, 1)).value).to.equal(1);
            expect(mf.squareAt(new Coordinate(2, 2)).value).to.equal(1);
            expect(mf.squareAt(new Coordinate(2, 3)).value).to.equal(0);

            expect(mf._minesLaid).to.equal(2);
            stub.restore();
        });
    });

    describe('#validateCoordinate', function () {
        it("should throw an error if coordinate is out of bounds", function () {
            let mf = new Minefield({width: 10, height: 10, mines: 10});
            expect(() => mf.validateCoordinate(new Coordinate(10, 9))).to.throw();
            expect(() => mf.validateCoordinate(new Coordinate(-1, 0))).to.throw();
        });
    });

    describe('#reveal', function () {
        it("should reveal single square if it isn't empty or reveal empty square and its neighbors recursively until non-empty squares are reached", function () {

            let stub = sinon.stub(Coordinate, 'random');
            stub.onCall(0).returns(new Coordinate(0, 0));

            let mf = new Minefield({width: 3, height: 3, mines: 1});

            // minefield layout
            // x 1 0
            // 1 1 0
            // 0 0 0

            // reveal (1,0), this should reveal only one square (1,0)
            let visitedCoords = mf.reveal(new Coordinate(1, 0));
            expect(visitedCoords).to.have.deep.members([new Coordinate(1, 0)]);
            expect(mf._revealedSquares).to.equal(1);
            expect(mf.isAllRevealed()).to.be.false;

            // reveal (2,0), this should reveal all remaining hidden squares except (0,0)
            visitedCoords = mf.reveal(new Coordinate(2, 0));
            expect(visitedCoords).to.have.deep.members([
                new Coordinate(2, 0),
                new Coordinate(0, 1),
                new Coordinate(1, 1),
                new Coordinate(2, 1),
                new Coordinate(0, 2),
                new Coordinate(1, 2),
                new Coordinate(2, 2)
            ]);
            expect(mf._revealedSquares).to.equal(8);
            expect(mf.isAllRevealed()).to.be.true;

            stub.restore();
        });

        it('should throw an error if coordinate is out of bounds', function () {
            let mf = new Minefield({width: 3, height: 3, mines: 1});
            expect(() => mf.reveal(new Coordinate(3,0))).to.throw();
        });

        it('should throw an error if square is already revealed', function () {
            let stub = sinon.stub(Coordinate, 'random');
            stub.onCall(0).returns(new Coordinate(0, 0));

            let mf = new Minefield({width: 3, height: 3, mines: 1});
            mf.reveal(new Coordinate(1,0));
            expect(() => mf.reveal(new Coordinate(1,0))).to.throw();

            stub.restore();
        });
        it('should throw an error if the target square is flagged', function () {
            let stub = sinon.stub(Coordinate, 'random');
            stub.onCall(0).returns(new Coordinate(0, 0));

            let mf = new Minefield({width: 3, height: 3, mines: 1});
            mf.flag(new Coordinate(1,0));
            expect(() => mf.reveal(new Coordinate(1,0))).to.throw();

            stub.restore();
        });
    });
});

