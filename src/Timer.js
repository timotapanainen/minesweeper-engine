
module.exports = class Timer {

    start() {
        this.startTime = Date.now();
    }

    started() {
        return this.startTime !== undefined
    }

    stop() {
        if (!this.started())
            throw new Error("timer has not been started");
        this.endTime = Date.now();
    }

    stopped() {
        return this.endTime !== undefined;
    }

    duration() {
        if (!this.started())
            return 0;
        if (this.stopped())
            return this.endTime - this.startTime;
        return Date.now() - this.startTime;
    }
};
