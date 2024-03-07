import { CoordsModel } from "../models/Cell.model.js"
import { ScoreModel } from "../models/Score.model.js"
import { Board } from "./Board.js"
import { Cell } from "./Cell.js"
import { Stack } from "./Stack.js"
import { Timer } from "./Timer.js"
import { Util } from "./Util.js"
export class Game {

    private _isOn = false
    private _isHint = false
    private _isMegaHint = false
    private _megaHintsCount = 1
    private _hintCount = 3
    private _shownCount = 0
    private _markedCount = 0
    private _mines!: number
    private _time!: Timer
    private _life = 3
    private _board!: Board
    private _size!: number
    private _safeClicks = 3
    private _isManualMines = false
    private _placedMines = 0
    private _stack!: Stack<any>

    constructor(boardSize = 4, mines = 2) {
        this.restart(boardSize, mines)
    }

    startGame(coords: CoordsModel): void {

        if (!this._isManualMines) this._board.placeMines(this._mines, coords)

        this._board.countMinesAround()
        this._time = new Timer()

        this._isOn = true
        this._time.start()
    }

    checkWin(): boolean {
        return this._markedCount + this._shownCount === this._size ** 2
    }

    checkLose(): boolean {
        return this._life <= 0
    }

    gameOver(isWin: boolean) {
        this._time.stop()
        if (isWin) {
            const newScore = this.getScore()
            this.gameWin(newScore)
        }
    }

    getScore(): ScoreModel {
        return { name: '', time: this._time.elapsedTime }
    }

    gameWin(newScore: ScoreModel) {

    }

    isTopTen(scores: Array<ScoreModel>, newScore: ScoreModel): number | boolean | Error {

        const idx = scores.findIndex(score => newScore.time >= newScore.time)

        if (idx < 0) return new Error('Problem with array scores')

        if (idx < 10) return idx

        return false
    }


    expandShown(rowIdx: number, colIdx: number): { htmlStr: string, row: number, col: number, minesAround: number }[] {
        let expandedCells: { row: number; col: number; htmlStr: string, minesAround: number }[] = []

        this._board.neighborsLoop({ row: rowIdx, col: colIdx }, (cell, i, j) => {
            if (cell.isShown || cell.isMine || cell.isMarked) return expandedCells

            this._board.board[i][j].isShown = true
            this._shownCount++;
            let htmlStr = cell.htmlStr
            let minesAround = cell.MinesAround

            expandedCells.push({ htmlStr, row: i, col: j, minesAround })

        })

        return expandedCells
    }

    restart(boardSize = this._size, mines = this._mines) {

        this._isOn = false
        this._isMegaHint = false
        this._shownCount = 0
        this._markedCount = 0
        this._size = boardSize
        this._mines = mines
        this._placedMines = 0
        this._isManualMines = false
        this._isHint = false
        this._megaHintsCount = 1
        this._hintCount = 3
        this._life = 2
        this._safeClicks = 3
        this._isManualMines = false

        if (this._time) {
            this._time.stop()
            this._time.render()
        }

        this._board = new Board(boardSize)
        this._stack = new Stack()

    }

    safeClick(): Cell | string {
        if (this._safeClicks <= 0) return 'No more safe clicks.'

        const freeCells = this._size ** 2 - this._shownCount - (this._mines - (3 - this._life))
        if (freeCells <= 0) return 'No more free cells.'

        let attempts = 0
        let cell
        do {
            let rndRow = Util.getRandomInt(this._size)
            let rndCol = Util.getRandomInt(this._size)
            cell = this._board.board[rndRow][rndCol]

            if (!cell.isShown && !cell.isMine) {
                this._safeClicks -= 1
                return cell
            }
            attempts += 1
        } while (attempts < 288)

        return 'Failed to find a safe cell after multiple attempts.';
    }

    placeMine(coords: CoordsModel): void {
        const { row, col } = coords
        const cell = this._board.board[row][col]
        this._board.placeMine(cell)

        this._placedMines = this._placedMines - 1
    }

    saveMove(): void {

        const gameTemplate = new Game(this._size, this._mines)

        gameTemplate.shownCount = this._shownCount
        gameTemplate.markedCount = this._markedCount
        gameTemplate.life = this._life
        gameTemplate.board = this._board.clone()

        this._stack.push(gameTemplate)
    }

    undo(): void {
        const savedGame: Game = this._stack.pop()

        this._shownCount = savedGame.shownCount
        this._markedCount = savedGame.markedCount
        this._life = savedGame.life
        this._board = savedGame.board
    }

    getCellInstance(coords: CoordsModel) {
        return this._board.getCell(coords)
    }

    //Getters

    get isOn(): boolean { return this._isOn }

    get life(): number { return this._life }

    get shownCount(): number { return this._shownCount }

    get markedCount(): number { return this._markedCount }

    get mines(): number { return this._mines }

    get board(): Board { return this._board }

    get size(): number { return this._size }

    get isHint(): boolean { return this._isHint }

    get hintCount(): number { return this._hintCount }

    get safeClicks(): number { return this._safeClicks }

    get isManualMines(): boolean { return this._isManualMines }

    get placedMines(): number { return this._placedMines }

    get isMegaHint(): boolean { return this._isMegaHint }

    get megaHintsCount(): number { return this._megaHintsCount }

    //Setters

    set isOn(isOn: boolean) { this._isOn = isOn }

    set life(amount: number) { this._life = amount }

    set shownCount(amount: number) { this._shownCount = amount }

    set markedCount(amount: number) { this._markedCount = amount }

    set mines(amount: number) { this._mines = amount }

    set board(board: Board) { this._board = board }

    set hintCount(amount: number) { this._hintCount = amount }

    set isHint(isHint: boolean) { this._isHint = isHint }

    set safeClicks(amount: number) { this._safeClicks = amount }

    set isManualMines(isManuallMines: boolean) { this._isManualMines = isManuallMines }

    set placedMines(amount: number) { this._placedMines = amount }

    set isMegaHint(isMegaHint: boolean) { this._isMegaHint = isMegaHint }

    set megaHintsCount(amount: number) { this._megaHintsCount = amount }
}