import { Cell } from "./Cell.js";
import { Util } from "./util.js";
export class Board {
    constructor(size) {
        this.board = [];
        this.initializeBoard(size);
    }
    initializeBoard(size) {
        this.board = new Array(size);
        for (let i = 0; i < size; i++) {
            this.board[i] = new Array(size);
            for (let j = 0; j < size; j++) {
                this.board[i][j] = new Cell();
            }
        }
    }
    placeMines(minesCount) {
        let placedMines = 0;
        while (placedMines < minesCount) {
            const row = Util.getRandomInt(this.board.length);
            const col = Util.getRandomInt(this.board[0].length);
            if (!this.board[row][col].getMine()) {
                this.board[row][col].setMine();
                placedMines++;
            }
        }
    }
    countMinesAround() {
        let size = this.board.length;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.board[i][j].getMine())
                    continue;
                let minesAround = 0;
                this.countNeighbors(i, j, (cell) => {
                    if (cell.getMine())
                        minesAround++;
                });
                this.board[i][j].setMinesAround(minesAround);
            }
        }
    }
    countNeighbors(row, col, callback) {
        for (let i = row - 1; i <= row + 1; i++) {
            if (i < 0 || i >= this.board.length)
                continue;
            for (let j = col - 1; j <= col + 1; j++) {
                if (i === row && j === col)
                    continue;
                if (j < 0 || j >= this.board[i].length)
                    continue;
                const cell = this.board[i][j];
                callback(cell, i, j);
            }
        }
    }
    getCell(row, col) {
        return this.board[row][col];
    }
}
