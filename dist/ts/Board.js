var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Board_instances, _Board_getBombSvg, _Board_getNumberHtml;
import { Cell } from "./Cell.js";
import { Util } from "./Util.js";
export class Board {
    constructor(size) {
        _Board_instances.add(this);
        this.board = [];
        this.initializeBoard(size);
    }
    initializeBoard(size) {
        this.board = new Array(size);
        for (let i = 0; i < size; i++) {
            this.board[i] = new Array(size);
            for (let j = 0; j < size; j++) {
                this.board[i][j] = new Cell('<span>0</span>', { row: i, col: j });
            }
        }
    }
    placeMines(minesCount, cellCord) {
        let placedMines = 0;
        while (placedMines < minesCount) {
            const row = Util.getRandomInt(this.board.length);
            const col = Util.getRandomInt(this.board[0].length);
            if (!this.board[row][col].getMine() && (row !== cellCord.row && col !== cellCord.col)) {
                this.placeMine(this.board[row][col]);
                placedMines++;
            }
        }
    }
    placeMine(cell) {
        cell.setMine(true);
        cell.setHtmlStr(__classPrivateFieldGet(this, _Board_instances, "m", _Board_getBombSvg).call(this));
    }
    countMinesAround() {
        let size = this.board.length;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.board[i][j].getMine())
                    continue;
                let minesAround = 0;
                this.neighborsLoop(i, j, (cell) => {
                    if (cell.getMine())
                        minesAround++;
                });
                this.board[i][j].setMinesAround(minesAround);
                this.board[i][j].setHtmlStr(__classPrivateFieldGet(this, _Board_instances, "m", _Board_getNumberHtml).call(this, minesAround));
            }
        }
    }
    neighborsLoop(row, col, callback) {
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
    clone() {
        const clonedBoard = new Board(this.board.length);
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                clonedBoard.board[i][j] = this.board[i][j].clone();
            }
        }
        return clonedBoard;
    }
    //Getters
    getCell(row, col) {
        return this.board[row][col];
    }
}
_Board_instances = new WeakSet(), _Board_getBombSvg = function _Board_getBombSvg() {
    return (`<svg class="bomb" viewBox="0 0 512 512"><path d="M287.586 15.297l3.504 110.963 31.537-110.963h-35.04zm-95.78.238l-1.75 236.047-170.533-43.33L130.486 377.69l-88.77-5.174 114.432 112.357-44.466-75.867L186.896 417l-51.748-109.94 110.114 79.956-12.635-185.23.002.003 75.212 170.57 75.816-89.95-6.62 154.582 60.173-39.978-20.388 79.486 75.756-142.787-75.924 1.94L487.32 155.87l-131.402 73.08-12.264-139.69-65.41 140.336-86.435-214.06h-.003zM45.503 44.095L39.355 75.94 154.285 218h.002l-77.6-166.836-31.185-7.07zm422.27 24.776l-31.184 7.07-43.738 107.37 81.068-82.59-6.147-31.85zM279.208 403.61c-40.176 0-72.708 32.537-72.708 72.71 0 5.725.636 10.706 1.887 16.05 7.25-32.545 36.097-56.655 70.82-56.655 34.82 0 63.673 23.97 70.82 56.656 1.218-5.277 1.888-10.404 1.888-16.05 0-40.175-32.536-72.71-72.71-72.71z"/></svg>`);
}, _Board_getNumberHtml = function _Board_getNumberHtml(number) {
    let color;
    switch (number) {
        case 1:
            color = '#0332fe';
            break;
        case 2:
            color = '#019f02';
            break;
        case 3:
            color = '#ff2600';
            break;
        case 4:
            color = '#93208f';
            break;
        case 5:
            color = '#ff7f29';
            break;
        case 6:
            color = '#ff3fff';
            break;
        case 7:
            color = '#53b8b4';
            break;
        case 8:
            color = '#22ee0f';
            break;
        default:
            color = '';
            break;
    }
    return `<span style="color:${color};" class="number">${number}</span>`;
};
