export class Timer {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.running = false;
    }
    start() {
        if (!this.running) {
            this.startTime = performance.now() - this.elapsedTime;
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    step(timestamp) {
        if (this.running) {
            this.elapsedTime = timestamp - this.startTime;
            this.render();
            requestAnimationFrame(this.step.bind(this));
        }
    }
    stop() {
        this.running = false;
    }
    render() {
        let timeStr = this.getTime();
        const elTimer = document.querySelector('.timer');
        if (elTimer) {
            elTimer.innerText = timeStr;
        }
    }
    getTime() {
        let minutes = Math.floor(this.elapsedTime / 60000);
        let seconds = ((this.elapsedTime % 60000) / 1000).toFixed(2);
        let minutesStr = minutes < 10 ? '0' + minutes : minutes;
        let secondsStr = (parseInt(seconds) < 10) ? '0' + seconds : seconds;
        return `${minutesStr}:${secondsStr}`;
    }
}
