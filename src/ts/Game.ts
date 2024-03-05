import { Board } from "./Board.js"
import { Timer } from "./Timer.js"
export class Game {

    private isOn = false
    private isHint = false
    private hintCount = 3
    private shownCount = 0
    private markedCount = 0
    private mines: number
    private time: Timer
    private lifes = 3
    private board: Board
    private size: number

    constructor(boardSize = 4, mines = 2) {
        this.mines = mines
        this.size = boardSize

        this.board = new Board(boardSize)
        this.time = new Timer()

    }

    startGame(cellCord: { row: number, col: number }): void {
        this.board.placeMines(this.mines, cellCord)
        this.board.countMinesAround()

        this.setLifes(3)
        this.isOn = true
        this.time.start()

    }

    checkWin(): boolean {
        return this.markedCount + this.shownCount === this.size ** 2
    }

    gameOver(isWin: boolean) {
        this.time.stop()
    }

    expandShown(rowIdx: number, colIdx: number): { htmlStr: string, row: number, col: number, minesAround: number }[] {
        let expandedCells: { row: number; col: number; htmlStr: string, minesAround: number }[] = []

        this.board.countNeighbors(rowIdx, colIdx, (cell, i, j) => {
            if (cell.isShown || cell.isMine || cell.isMarked) return expandedCells

            this.board.board[i][j].setShown();
            this.shownCount++;
            let htmlStr = cell.getHtmlStr();
            let minesAround = cell.getMinesAround()

            expandedCells.push({ htmlStr, row: i, col: j, minesAround })

        })

        return expandedCells
    }

    restart(boardSize = this.size, mines = this.mines) {

        this.isOn = false
        this.shownCount = 0
        this.markedCount = 0
        this.size = boardSize
        this.mines = mines

        this.time.stop()
        this.time = new Timer()
        this.time.render()

        this.board = new Board(boardSize)

    }

    //Getters

    getIsOn(): boolean {
        return this.isOn
    }

    getLifes(): number {
        return this.lifes
    }

    getCellInstance(row: number, col: number) {
        return this.board.getCell(row, col)
    }

    getShowCount(): number {
        return this.shownCount
    }

    getMarkCount(): number {
        return this.markedCount
    }

    getMines(): number {
        return this.mines
    }

    getBoard(): Board {
        return this.board
    }

    getSize(): number {
        return this.size
    }

    getIsHint(): boolean {
        return this.isHint
    }

    //Setters

    setIsOn(): void {
        this.isOn = !this.isOn
    }

    setLifes(amount: number): void {
        this.lifes = amount
    }

    setShowCount(amount: number): void {
        this.shownCount = amount
    }

    setMarkedCount(amount: number): void {
        this.markedCount = amount

    }

    setMines(amount: number): void {
        this.mines = amount
    }

    setBoard(board: Board): void {
        this.board = board
    }
}