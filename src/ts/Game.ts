import { Board } from "./Board.js";
import { Cell } from "./Cell.js";


export class Game {

    interval: any
    isOn: boolean;
    shownCount: number;
    time: any;
    lives: any;
    board: Board

    constructor(boardSize: number, mines: number) {
        this.isOn = false
        this.shownCount = 0
        this.time = 0
        this.lives = 3
        this.board = new Board(boardSize)
        this.board.placeMines(mines)
        this.board.countMinesAround()
        this.renderBoard()
        this.handleEventListeners()

    }

    renderBoard(): void {
        const elBoard = document.querySelector('.board-container') as HTMLDivElement
        let strHtml: Array<Array<string>>

        strHtml = this.board.board.map((row, rowIdx) => row.map((cell, colIdx) =>
            `<div class="cell hidden" data-row=${rowIdx} data-col=${colIdx}>X</div>`
        ))
        if (elBoard) {
            elBoard.style.gridTemplateColumns = `repeat(${this.board.board.length}, 1fr)`
            elBoard.style.gridTemplateRows = `repeat(${this.board.board.length}, 1fr)`
        }

        elBoard.innerHTML = strHtml.flat().join("")

    }

    onCellClick(ev: Event): void {
        const target = ev.target as HTMLElement;

        const rowStr = target.getAttribute('data-row');
        const colStr = target.getAttribute('data-col');

        if (!rowStr || !colStr) return

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

    }

    onFlagClick(ev: Event) {
        // if (!this.isOn) return

        const target = ev.target as HTMLElement;

        const rowStr = target.getAttribute('data-row');
        const colStr = target.getAttribute('data-col');

        if (!rowStr || !colStr) return

        const row = parseInt(rowStr)
        const col = parseInt(colStr)

        const cell = this.board.getCell(row, col)
        cell.getMarked()

    }

    getValueImg(minesAround: number): string {

        let value: number | string = minesAround
        if (value < 0) value = '\u{1F4A3}'

        return value.toString()
    }

    renderCell(renderType: string, row: number, col: number) {
      
        const elCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLDivElement
        elCell.innerText = renderType
    }

    handleEventListeners(): void {

        const elCells = document.querySelectorAll('.cell')

        elCells.forEach(cell => {
            cell.addEventListener('click', (ev) => this.onCellClick(ev))
            cell.addEventListener('contextmenu', (ev) => this.onFlagClick(ev))
        })
    }

    updateLife(amount: number) {
        this.lives += amount
    }

    gameOver(isWin: boolean) {

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


}