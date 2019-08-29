const Timer = require('../src/Timer');
const sinon = require('sinon');
const expect = require('chai').expect

let clock;
let timer;

describe('Timer', function () {
    beforeEach(function() {
        clock = sinon.useFakeTimers();
        timer = new Timer();
    });

    afterEach(function() {
        clock.restore();
    });

    describe('#duration', function () {
        it('should return 0 if timer has not been started', function () {
            expect(new Timer().duration()).to.equal(0);
        });
        it('should return elapsed time if timer has been started but not stopped', function () {
            timer.start();
            clock.tick(20); // advance the clock by 20 milliseconds
            expect(timer.duration()).to.equal(20);
        });
        it('should return elapsed time when stopped', function() {
            timer.start();
            clock.tick(50);
            timer.stop();
            expect(timer.duration()).to.equal(50);
        });
    });

    describe('#started', function() {
       it('should return false if timer has not been started', function() {
          expect(timer.started()).to.be.false;
       });
       it('should return true if timer has been started', function() {
           timer.start();
           expect(timer.started()).to.be.true;
       });
    });

});

