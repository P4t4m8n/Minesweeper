import { Board } from "./Board.js"
import { Cell } from "./Cell.js"
import { Timer } from "./Timer.js"
import { Util } from "./util.js"
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
    private safeClicks = 3

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
        this.setSafeClicks(3)
        this.setHintCount(3)
        this.setIsOn(true)
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

        this.board.neighborsLoop(rowIdx, colIdx, (cell, i, j) => {
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

    safeClick(): Cell | string {

        if (this.safeClicks <= 0) return 'no more safe clicks'
        console.log(this.size ** 2)
        if (this.size ** 2 - this.shownCount <= + this.mines - (3 - this.lifes)) return 'no more free cells'

        let rndRow = Util.getRandomInt(this.size)
        let rndCol = Util.getRandomInt(this.size)

        let cell = this.board.board[rndRow][rndCol]
        if (cell.getShown() || cell.getMine()) return this.safeClick()

        this.safeClicks = this.safeClicks - 1

        return cell

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

    getHintsCount(): number {
        return this.hintCount
    }

    getSafeClicks(): number {
        return this.safeClicks
    }


    //Setters

    setIsOn(isOn: boolean): void {
        this.isOn = isOn
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

    setHintCount(amount: number): void {
        this.hintCount = amount
    }

    setIsHint(isHint: boolean): void {
        this.isHint = isHint
    }

    setSafeClicks(amount: number) {
        this.safeClicks = amount
    }
}