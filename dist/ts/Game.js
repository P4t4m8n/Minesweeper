import { Board } from "./Board.js";
import { Timer } from "./Timer.js";
export class Game {
    constructor(boardSize = 4, mines = 2) {
        this.isOn = false;
        this.shownCount = 0;
        this.markedCount = 0;
        this.lifes = 3;
        this.mines = mines;
        this.size = boardSize;
        this.board = new Board(boardSize);
        this.time = new Timer();
    }
    startGame(cellCord) {
        this.board.placeMines(this.mines, cellCord);
        this.board.countMinesAround();
        this.setLifes(3);
        this.isOn = true;
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
        this.board.countNeighbors(rowIdx, colIdx, (cell, i, j) => {
            if (cell.isShown || cell.isMine || cell.isMarked)
                return expandedCells;
            this.board.board[i][j].setShown();
            this.shownCount++;
            let minesAround = cell.getMinesAround();
            expandedCells.push({ minesAround, row: i, col: j });
            console.log("cell:", cell);
        });
        return expandedCells;
    }
    restart(boardSize = this.size, mines = this.mines) {
        this.isOn = false;
        this.shownCount = 0;
        this.markedCount = 0;
        this.size = boardSize;
        this.mines = mines;
        this.time.stop();
        this.time = new Timer();
        this.time.render();
        this.board = new Board(boardSize);
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
    //Setters
    setIsOn() {
        this.isOn = !this.isOn;
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
}
