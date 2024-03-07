import { Board } from "./Board.js";
import { Stack } from "./Stack.js";
import { Timer } from "./Timer.js";
import { Util } from "./Util.js";
export class Game {
    constructor(boardSize = 4, mines = 2) {
        this._isOn = false;
        this._isHint = false;
        this._isMegaHint = false;
        this._megaHintsCount = 1;
        this._hintCount = 3;
        this._shownCount = 0;
        this._markedCount = 0;
        this._life = 3;
        this._safeClicks = 3;
        this._isManualMines = false;
        this._placedMines = 0;
        this.restart(boardSize, mines);
    }
    startGame(coords) {
        if (!this._isManualMines)
            this._board.placeMines(this._mines, coords);
        this._board.countMinesAround();
        this._time = new Timer();
        this._isOn = true;
        this._time.start();
    }
    checkWin() {
        return this._markedCount + this._shownCount === Math.pow(this._size, 2);
    }
    checkLose() {
        return this._life <= 0;
    }
    gameOver(isWin) {
        this._time.stop();
        if (isWin) {
            const newScore = this.getScore();
            this.gameWin(newScore);
        }
    }
    getScore() {
        return { name: '', time: this._time.elapsedTime };
    }
    gameWin(newScore) {
    }
    isTopTen(scores, newScore) {
        const idx = scores.findIndex(score => newScore.time >= newScore.time);
        if (idx < 0)
            return new Error('Problem with array scores');
        if (idx < 10)
            return idx;
        return false;
    }
    expandShown(rowIdx, colIdx) {
        let expandedCells = [];
        this._board.neighborsLoop({ row: rowIdx, col: colIdx }, (cell, i, j) => {
            if (cell.isShown || cell.isMine || cell.isMarked)
                return expandedCells;
            this._board.board[i][j].isShown = true;
            this._shownCount++;
            let htmlStr = cell.htmlStr;
            let minesAround = cell.MinesAround;
            expandedCells.push({ htmlStr, row: i, col: j, minesAround });
        });
        return expandedCells;
    }
    restart(boardSize = this._size, mines = this._mines) {
        this._isOn = false;
        this._isMegaHint = false;
        this._shownCount = 0;
        this._markedCount = 0;
        this._size = boardSize;
        this._mines = mines;
        this._placedMines = 0;
        this._isManualMines = false;
        this._isHint = false;
        this._megaHintsCount = 1;
        this._hintCount = 3;
        this._life = 2;
        this._safeClicks = 3;
        this._isManualMines = false;
        if (this._time) {
            this._time.stop();
            this._time.render();
        }
        this._board = new Board(boardSize);
        this._stack = new Stack();
    }
    safeClick() {
        if (this._safeClicks <= 0)
            return 'No more safe clicks.';
        const freeCells = Math.pow(this._size, 2) - this._shownCount - (this._mines - (3 - this._life));
        if (freeCells <= 0)
            return 'No more free cells.';
        let attempts = 0;
        let cell;
        do {
            let rndRow = Util.getRandomInt(this._size);
            let rndCol = Util.getRandomInt(this._size);
            cell = this._board.board[rndRow][rndCol];
            if (!cell.isShown && !cell.isMine) {
                this._safeClicks -= 1;
                return cell;
            }
            attempts += 1;
        } while (attempts < 288);
        return 'Failed to find a safe cell after multiple attempts.';
    }
    placeMine(coords) {
        const { row, col } = coords;
        const cell = this._board.board[row][col];
        this._board.placeMine(cell);
        this._placedMines = this._placedMines - 1;
    }
    saveMove() {
        const gameTemplate = new Game(this._size, this._mines);
        gameTemplate.shownCount = this._shownCount;
        gameTemplate.markedCount = this._markedCount;
        gameTemplate.life = this._life;
        gameTemplate.board = this._board.clone();
        this._stack.push(gameTemplate);
    }
    undo() {
        const savedGame = this._stack.pop();
        this._shownCount = savedGame.shownCount;
        this._markedCount = savedGame.markedCount;
        this._life = savedGame.life;
        this._board = savedGame.board;
    }
    getCellInstance(coords) {
        return this._board.getCell(coords);
    }
    //Getters
    get isOn() { return this._isOn; }
    get life() { return this._life; }
    get shownCount() { return this._shownCount; }
    get markedCount() { return this._markedCount; }
    get mines() { return this._mines; }
    get board() { return this._board; }
    get size() { return this._size; }
    get isHint() { return this._isHint; }
    get hintCount() { return this._hintCount; }
    get safeClicks() { return this._safeClicks; }
    get isManualMines() { return this._isManualMines; }
    get placedMines() { return this._placedMines; }
    get isMegaHint() { return this._isMegaHint; }
    get megaHintsCount() { return this._megaHintsCount; }
    //Setters
    set isOn(isOn) { this._isOn = isOn; }
    set life(amount) { this._life = amount; }
    set shownCount(amount) { this._shownCount = amount; }
    set markedCount(amount) { this._markedCount = amount; }
    set mines(amount) { this._mines = amount; }
    set board(board) { this._board = board; }
    set hintCount(amount) { this._hintCount = amount; }
    set isHint(isHint) { this._isHint = isHint; }
    set safeClicks(amount) { this._safeClicks = amount; }
    set isManualMines(isManuallMines) { this._isManualMines = isManuallMines; }
    set placedMines(amount) { this._placedMines = amount; }
    set isMegaHint(isMegaHint) { this._isMegaHint = isMegaHint; }
    set megaHintsCount(amount) { this._megaHintsCount = amount; }
}
