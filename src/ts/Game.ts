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

    constructor(boardSize: number, mines: number) {
        this.mines = mines
        this.size = boardSize

        this.board = new Board(boardSize)
        this.time = new Timer()

        this.board.placeMines(mines)
        this.board.countMinesAround()
        this.renderBoard()
        this.handleEventListeners()

    }

    renderBoard(): void {
        const elBoard = document.querySelector('.board-container') as HTMLDivElement
        let strHtml: Array<Array<string>>

        strHtml = this.board.board.map((row, rowIdx) => row.map((cell, colIdx) =>
            `<div class="cell coverd" data-row=${rowIdx} data-col=${colIdx}></div>`
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
        const target = ev.target as HTMLElement;
        if (!target.classList.contains('cell')) return

        const rowStr = target.getAttribute('data-row');
        const colStr = target.getAttribute('data-col');

        if (!rowStr || !colStr) return

        if (!this.isOn) this.startGame()

        const row = parseInt(rowStr)
        const col = parseInt(colStr)

        const cell = this.board.getCell(row, col)
        let renderType = ' '

        if (cell.getShown()) return
        if (cell.getMarked()) return

        if (cell.isMine) {
            this.updateLife(-1)
            renderType = '💣'
        }

        else if (cell.getMinesAround() > 0) {
            cell.setShown()
            renderType = cell.getMinesAround() + ''
            this.shownCount++
        }

        else this.expandShown(row, col)

        this.renderCell(renderType, row, col)
        this.updateShown()
        this.checkWin()

    }

    onFlagClick(ev: Event) {
        ev.preventDefault()
        if (!this.isOn) return

        const target = ev.target as HTMLElement;

        const rowStr = target.getAttribute('data-row');
        const colStr = target.getAttribute('data-col');

        if (!rowStr || !colStr) return

        const row = parseInt(rowStr)
        const col = parseInt(colStr)

        const cell = this.board.getCell(row, col)
        const isMarked = cell.getMarked()
        if (isMarked)
            this.updateMarked(-1)
        else {
            if (this.markedCount >= this.mines) return alert('Max flags')
            this.updateMarked(1)
        }
        cell.setMarked()
        this.renderCell('🚩', row, col)


        this.checkWin()

    }

    checkWin() {
        if (this.markedCount + this.shownCount === this.size ** 2) this.gameOver(true)
    }

    renderCell(renderType: string, row: number, col: number) {

        const elCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLDivElement
        elCell.classList.remove('coverd')
        elCell.classList.add('un-coverd')
        elCell.innerText = renderType
    }

    handleEventListeners(): void {
        const elBoard = document.querySelector('.board-container') as HTMLDivElement
        elBoard.addEventListener('click', this.onCellClick.bind(this));
        elBoard.addEventListener('contextmenu', this.onFlagClick.bind(this));

    }

    gameOver(isWin: boolean) {
        if (isWin) alert('Win')
        else alert('Lose')
    }

    expandShown(rowIdx: number, colIdx: number): void {
        this.board.countNeighbors(rowIdx, colIdx, (cell, i, j) => {
            if (cell.isShown || cell.isMine || cell.isMarked) return
            this.board.board[i][j].setShown()
            this.shownCount++
            let minesAroundStr = cell.getMinesAround() + ''
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
        this.lives += amount
        let lifesStr = this.lives + ''
        const elLifes = document.querySelector('.life') as HTMLSpanElement
        elLifes.innerText = lifesStr

        if (this.lives <= 0) this.gameOver(false)
    }

    restart() {
        this.isOn = false
        this.shownCount = 0
        this.markedCount = 0
        this.lives = 3
        this.time.stop()
        this.time = new Timer()
        this.time.render()

        this.board = new Board(this.size)
        this.board.placeMines(this.mines)
        this.board.countMinesAround()

        this.renderBoard();
        this.handleEventListeners()

        // Additional reset actions as needed
    }

}