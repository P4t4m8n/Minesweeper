
export class Timer {
    private startTime: number
    private _elapsedTime: number
    private running: boolean

    constructor() {
        this.startTime = 0
        this._elapsedTime = 0
        this.running = false
    }

    start(): void {
        if (!this.running) {
            this.startTime = performance.now() - this._elapsedTime
            this.running = true
            requestAnimationFrame(this.step.bind(this))
        }
    }

    step(timestamp: number): void {
        if (this.running) {
            this._elapsedTime = timestamp - this.startTime
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
        let minutes = Math.floor(this._elapsedTime / 60000)
        let seconds = ((this._elapsedTime % 60000) / 1000).toFixed(2)

        let minutesStr = minutes < 10 ? '0' + minutes : minutes
        let secondsStr = (parseInt(seconds) < 10) ? '0' + seconds : seconds

        return `${minutesStr}:${secondsStr}`
    }

    get elapsedTime() {
        return this._elapsedTime
    }


}


