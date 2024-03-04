
export class Timer {
    startTime: number
    elapsedTime: number
    running: boolean

    constructor() {
        this.startTime = 0
        this.elapsedTime = 0
        this.running = false
    }

    start(): void {
        if (!this.running) {
            this.startTime = performance.now() - this.elapsedTime
            this.running = true
            requestAnimationFrame(this.step.bind(this))
        }
    }

    step(timestamp: number): void {
        if (this.running) {
            this.elapsedTime = timestamp - this.startTime
            this.render()
            requestAnimationFrame(this.step.bind(this))
        }
    }

    stop(): void {
        this.running = false
    }

    render(): void {
        let timeStr = this.getTime()

        const elTimer = document.querySelector('.timer') as HTMLDivElement
        if (elTimer) {
            elTimer.innerText = timeStr
        }
    }

    getTime(): string {
        let minutes = Math.floor(this.elapsedTime / 60000)
        let seconds = ((this.elapsedTime % 60000) / 1000).toFixed(2)

        let minutesStr = minutes < 10 ? '0' + minutes : minutes
        let secondsStr = (parseInt(seconds) < 10) ? '0' + seconds : seconds

        return `${minutesStr}:${secondsStr}`
    }
}


