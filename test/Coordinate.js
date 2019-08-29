const Coordinate = require('../src/Coordinate');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Coordinate', function () {

    describe('#random', function () {
        it('should return a random coordinate', function () {
            const stub = sinon.stub(Math, 'random');
            stub.onCall(0).returns(0.1);
            stub.onCall(1).returns(0.999);
            expect(Coordinate.random(10, 10)).to.deep.equal(new Coordinate(1, 9));
            stub.restore();
        });
    });
});

