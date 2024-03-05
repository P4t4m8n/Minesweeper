import { Board } from "./Board.js";
import { Timer } from "./Timer.js";
import { Util } from "./util.js";
export class Game {
    constructor(boardSize = 4, mines = 2) {
        this.isOn = false;
        this.isHint = false;
        this.hintCount = 3;
        this.shownCount = 0;
        this.markedCount = 0;
        this.lifes = 3;
        this.safeClicks = 3;
        this.isManuallMines = false;
        this.placedMines = 0;
        this.mines = mines;
        this.size = boardSize;
        this.board = new Board(boardSize);
        this.time = new Timer();
    }
    startGame(cellCord) {
        if (!this.isManuallMines)
            this.board.placeMines(this.mines, cellCord);
        this.board.countMinesAround();
        this.setLifes(3);
        this.setSafeClicks(3);
        this.setHintCount(3);
        this.setIsOn(true);
        this.time.start();
    }
    checkWin() {
        return this.markedCount + this.shownCount === Math.pow(this.size, 2);
    }
    gameOver(isWin) {
        this.time.stop();
    }
    expandShown(rowIdx, colIdx) {
        let expandedCells = [];
        this.board.neighborsLoop(rowIdx, colIdx, (cell, i, j) => {
            if (cell.isShown || cell.isMine || cell.isMarked)
                return expandedCells;
            this.board.board[i][j].setShown();
            this.shownCount++;
            let htmlStr = cell.getHtmlStr();
            let minesAround = cell.getMinesAround();
            expandedCells.push({ htmlStr, row: i, col: j, minesAround });
        });
        return expandedCells;
    }
    restart(boardSize = this.size, mines = this.mines) {
        this.isOn = false;
        this.shownCount = 0;
        this.markedCount = 0;
        this.size = boardSize;
        this.mines = mines;
        this.placedMines = 0;
        this.isManuallMines = false;
        this.time.stop();
        this.time = new Timer();
        this.time.render();
        this.board = new Board(boardSize);
    }
    safeClick() {
        if (this.safeClicks <= 0)
            return 'no more safe clicks';
        console.log(Math.pow(this.size, 2));
        if (Math.pow(this.size, 2) - this.shownCount <= +this.mines - (3 - this.lifes))
            return 'no more free cells';
        let rndRow = Util.getRandomInt(this.size);
        let rndCol = Util.getRandomInt(this.size);
        let cell = this.board.board[rndRow][rndCol];
        if (cell.getShown() || cell.getMine())
            return this.safeClick();
        this.safeClicks = this.safeClicks - 1;
        return cell;
    }
    placeMine(coords) {
        const { row, col } = coords;
        const cell = this.board.board[row][col];
        this.board.placeMine(cell);
        this.setPlacedMines(this.placedMines - 1);
    }
    //Getters
    getIsOn() {
        return this.isOn;
    }
    getLifes() {
        return this.lifes;
    }
    getCellInstance(row, col) {
        return this.board.getCell(row, col);
    }
    getShowCount() {
        return this.shownCount;
    }
    getMarkCount() {
        return this.markedCount;
    }
    getMines() {
        return this.mines;
    }
    getBoard() {
        return this.board;
    }
    getSize() {
        return this.size;
    }
    getIsHint() {
        return this.isHint;
    }
    getHintsCount() {
        return this.hintCount;
    }
    getSafeClicks() {
        return this.safeClicks;
    }
    getIsManuallMines() {
        return this.isManuallMines;
    }
    getPlacedMines() {
        return this.placedMines;
    }
    //Setters
    setIsOn(isOn) {
        this.isOn = isOn;
    }
    setLifes(amount) {
        this.lifes = amount;
    }
    setShowCount(amount) {
        this.shownCount = amount;
    }
    setMarkedCount(amount) {
        this.markedCount = amount;
    }
    setMines(amount) {
        this.mines = amount;
    }
    setBoard(board) {
        this.board = board;
    }
    setHintCount(amount) {
        this.hintCount = amount;
    }
    setIsHint(isHint) {
        this.isHint = isHint;
    }
    setSafeClicks(amount) {
        this.safeClicks = amount;
    }
    setIsManuallMines(isManuallMines) {
        this.isManuallMines = isManuallMines;
    }
    setPlacedMines(amount) {
        this.placedMines = amount;
    }
}
