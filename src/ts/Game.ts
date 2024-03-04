import { Board } from "./Board.js";
import { Timer } from "./Timer.js";


export class Game {

    isOn = false;
    shownCount = 0;
    markedCount = 0;
    mines: number
    time: Timer;
    lives = 3
    board: Board
    size: number
    private interval: any
    private startTime: number | undefined

    constructor(boardSize = 4, mines = 2) {
        this.mines = mines
        this.size = boardSize

        this.board = new Board(boardSize)
        this.time = new Timer()

        this.board.placeMines(mines)
        this.board.countMinesAround()
        this.renderBoard()
        this.#attachEventListeners()

    }

    renderBoard(): void {
        const elBoard = document.querySelector('.board-container') as HTMLDivElement
        let strHtml: Array<Array<string>>

        strHtml = this.board.board.map((row, rowIdx) => row.map((cell, colIdx) =>
            `<div class="cell coverd" data-row=${rowIdx} data-col=${colIdx}><span> </span></div>`
        ))

        if (elBoard) {
            elBoard.style.gridTemplateColumns = `repeat(${this.board.board.length}, 1fr)`
            elBoard.style.gridTemplateRows = `repeat(${this.board.board.length}, 1fr)`
        }

        elBoard.innerHTML = strHtml.flat().join("")

    }

    startGame(): void {
        this.updateLife(0)
        this.isOn = true
        this.time.start()

    }

    onCellClick(ev: Event): void {
        console.log("ev:", ev)
        ev.preventDefault()
        const target = ev.target as HTMLElement;
        if (!target.classList.contains('cell')) return

        const rowStr = target.getAttribute('data-row');
        const colStr = target.getAttribute('data-col');

        if (!rowStr || !colStr) return

        if (!this.isOn) this.startGame()

        const row = parseInt(rowStr)
        const col = parseInt(colStr)

        const cell = this.board.getCell(row, col)
        let renderType = `<span>0</span>`

        if (cell.getShown()) return
        if (cell.getMarked()) return

        if (cell.isMine) {
            this.updateLife(-1)
            renderType = this.#getBombSvg()
        }

        else if (cell.getMinesAround() > 0) {
            cell.setShown()
            renderType = this.#getNumberHtml(cell.getMinesAround())
            this.shownCount++
        }

        else this.expandShown(row, col)

        this.renderCell(renderType, row, col)
        this.updateShown()
        this.checkWin()

    }

    onContextClick(ev: Event) {
        ev.preventDefault()
        ev.stopPropagation()
        if (!this.isOn) return

        let target = ev.target as HTMLElement
        if (target.nodeName !== 'DIV') {
            target = target.closest('.cell') as HTMLElement
        }

        if (!target) return

        const rowStr = target.getAttribute('data-row');
        const colStr = target.getAttribute('data-col');

        if (!rowStr || !colStr) return

        const row = parseInt(rowStr)
        const col = parseInt(colStr)

        const cell = this.board.getCell(row, col)
        console.log("target:", target)

        if (cell.isShown) return

        const isMarked = cell.getMarked()

        console.log("isMarked:", isMarked)
        let renderType = `<span> </span>`

        if (isMarked)
            this.updateMarked(-1)

        else {
            if (this.markedCount >= this.mines) return alert('Max flags')
            this.updateMarked(1)
            renderType = this.#getMarkedSvg()
        }

        cell.setMarked()
        this.renderCell(renderType, row, col, true)

        this.checkWin()

    }

    checkWin() {
        if (this.markedCount + this.shownCount === this.size ** 2) this.gameOver(true)
    }

    renderCell(renderType: string, row: number, col: number, isContext = false) {

        const elCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLDivElement
        if (!elCell) {
            console.error(`Cell not found for row ${row}, col ${col}`)
            return
        }

        let elSpan = elCell.querySelector('span') as HTMLSpanElement

        if (!isContext) {
            elCell.classList.remove('coverd')
            elCell.classList.add('un-coverd')
        }

        elSpan.innerHTML = renderType
    }

    gameOver(isWin: boolean) {
        if (isWin) alert('Win')
        else alert('Lose')
        this.time.stop()
        this.#detachEventListeners()
    }

    expandShown(rowIdx: number, colIdx: number): void {
        this.board.countNeighbors(rowIdx, colIdx, (cell, i, j) => {
            if (cell.isShown || cell.isMine || cell.isMarked) return
            this.board.board[i][j].setShown()
            this.shownCount++
            let minesAroundStr = this.#getNumberHtml(cell.getMinesAround())
            this.renderCell(minesAroundStr, i, j)

            if (cell.minesAround === 0) {
                this.expandShown(i, j)
            }
        })
    }

    updateShown(): void {

        const elShown = document.querySelector('.shown') as HTMLSpanElement
        elShown.innerText = this.shownCount + ''
    }

    updateMarked(amount: number): void {
        this.markedCount += amount
        let markedStr = this.markedCount + ''
        const elMarked = document.querySelector('.marked') as HTMLSpanElement
        elMarked.innerText = markedStr
    }

    updateLife(amount: number): void {
        console.log("amount:", amount)
        this.lives += amount
        console.log("this.lives:", this.lives)
        let lifesStr = this.lives + ''
        const elLifes = document.querySelector('.life') as HTMLSpanElement
        elLifes.innerText = lifesStr

        if (this.lives <= 0) this.gameOver(false)
    }

    restart(boardSize = this.size, mines = this.mines) {

        this.isOn = false
        this.shownCount = 0
        this.markedCount = 0
        this.lives = 3
        this.size = boardSize
        this.mines = mines

        this.time.stop()
        this.time = new Timer()
        this.time.render()

        this.board = new Board(boardSize)
        this.board.placeMines(mines)
        this.board.countMinesAround()

        this.renderBoard();

    }

    #getBombSvg(): string {
        return (
            `<svg class="bomb" viewBox="0 0 512 512"><path d="M287.586 15.297l3.504 110.963 31.537-110.963h-35.04zm-95.78.238l-1.75 236.047-170.533-43.33L130.486 377.69l-88.77-5.174 114.432 112.357-44.466-75.867L186.896 417l-51.748-109.94 110.114 79.956-12.635-185.23.002.003 75.212 170.57 75.816-89.95-6.62 154.582 60.173-39.978-20.388 79.486 75.756-142.787-75.924 1.94L487.32 155.87l-131.402 73.08-12.264-139.69-65.41 140.336-86.435-214.06h-.003zM45.503 44.095L39.355 75.94 154.285 218h.002l-77.6-166.836-31.185-7.07zm422.27 24.776l-31.184 7.07-43.738 107.37 81.068-82.59-6.147-31.85zM279.208 403.61c-40.176 0-72.708 32.537-72.708 72.71 0 5.725.636 10.706 1.887 16.05 7.25-32.545 36.097-56.655 70.82-56.655 34.82 0 63.673 23.97 70.82 56.656 1.218-5.277 1.888-10.404 1.888-16.05 0-40.175-32.536-72.71-72.71-72.71z"/></svg>`
        )
    }

    #getNumberHtml(number: number): string {
        let color: string

        switch (number) {
            case 1:
                color = '#0332fe'
                break
            case 2:
                color = '#019f02'
                break
            case 3:
                color = '#ff2600'
                break
            case 4:
                color = '#93208f'
                break
            case 5:
                color = '#ff7f29'
                break
            case 6:
                color = '#ff3fff'
                break
            case 7:
                color = '#53b8b4'
                break
            case 8:
                color = '#22ee0f'
                break
            default:
                color = ''
                break

        }


        return `<span style="color:${color};" class="number">${number}</span>`

    }

    #getMarkedSvg(): string {
        return (
            `<svg  viewBox="0 0 24 24" ><g  stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <path d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
        )
    }

    #detachEventListeners(): void {
        const elBoard = document.querySelector('.board-container') as HTMLDivElement
        if (elBoard) {
            elBoard.removeEventListener('click', this.onCellClick.bind(this))
            elBoard.removeEventListener('contextmenu', this.onContextClick.bind(this))
        }
    }

    #attachEventListeners() {
        const elBoard = document.querySelector('.board-container') as HTMLDivElement
        if (elBoard) {
            elBoard.addEventListener('click', this.onCellClick.bind(this))
            elBoard.addEventListener('contextmenu', this.onContextClick.bind(this))
        }
    }
}