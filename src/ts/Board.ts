import { CoordsModel } from "../models/Cell.model.js"
import { Cell } from "./Cell.js"
import { Util } from "./Util.js"
export class Board {

    private _board: Array<Array<Cell>> = []

    constructor(size: number) {
        this.initializeBoard(size)
    }

    // initializeBoard(size: number): void {
    //     this._board = new Array(size)
    //     for (let row = 0; row < size; row++) {
    //         this._board[row] = new Array(size)
    //         for (let col = 0; col < size; col++) {
    //             this._board[row][col] = new Cell('<span>0</span>', { row: row, col: col })
    //         }
    //     }
    // }

    initializeBoard(size: number): void {
        this._board = Array.from({ length: size }, (_, row) =>
            Array.from({ length: size }, (_, col) =>
                new Cell('<span>0</span>', { row, col }))
        )
    }

    placeMines(minesCount: number, coords: CoordsModel): void {
        let placedMines = 0
        let loopBreaker = 0

        while (placedMines < minesCount && loopBreaker < 1000) {
            const row = Util.getRandomInt(this._board.length)
            const col = Util.getRandomInt(this._board[0].length)

            if (!this._board[row][col].isMine && (row !== coords.row && col !== coords.col)) {
                this.placeMine(this._board[row][col])
                placedMines++
            }
            loopBreaker++
        }
    }

    placeMine(cell: Cell): void {
        cell.isMine = true
        cell.HtmlStr = this.#getBombSvg()
    }

    countMinesAround(): void {

        let size = this._board.length

        for (let row = 0; row < size; row++) {

            for (let col = 0; col < size; col++) {

                if (this._board[row][col].isMine) continue

                let minesAround = 0

                this.neighborsLoop({ row, col }, (cell) => {
                    if (cell.isMine) minesAround++
                })

                this._board[row][col].MinesAround = minesAround
                this._board[row][col].HtmlStr = this.#getNumberCellContent(minesAround)

            }
        }

    }

    neighborsLoop(coords: CoordsModel, callback: (cell: Cell, idx?: number, jdx?: number) => void): void {
        const { row, col } = coords;

        const startRow = Math.max(0, row - 1);
        const endRow = Math.min(this._board.length - 1, row + 1);
        const startCol = Math.max(0, col - 1);
        const endCol = Math.min(this._board[0].length - 1, col + 1);

        for (let idx = startRow; idx <= endRow; idx++) {
            for (let jdx = startCol; jdx <= endCol; jdx++) {

                if (idx === row && jdx === col) continue

                const cell = this._board[idx][jdx]
                callback(cell, idx, jdx)
            }
        }
    }

    clone(): Board {

        const clonedBoard = new Board(this._board.length)

        for (let row = 0; row < this._board.length; row++) {
            for (let col = 0; col < this._board.length; col++) {
                clonedBoard._board[row][col] = this._board[row][col].clone();
            }
        }
        return clonedBoard;
    }

    getCell(coords: CoordsModel): Cell {
        const { row, col } = coords
        return this._board[row][col]
    }

    //Getters

    get board(): Array<Array<Cell>> {
        return this._board
    }

    //Setters
    set board(board: Array<Array<Cell>>) {
        this._board = board
    }

    //SVGS

    #getBombSvg(): string {
        return (
            `<svg class="bomb" viewBox="0 0 512 512"><path d="M287.586 15.297l3.504 110.963 31.537-110.963h-35.04zm-95.78.238l-1.75 236.047-170.533-43.33L130.486 377.69l-88.77-5.174 114.432 112.357-44.466-75.867L186.896 417l-51.748-109.94 110.114 79.956-12.635-185.23.002.003 75.212 170.57 75.816-89.95-6.62 154.582 60.173-39.978-20.388 79.486 75.756-142.787-75.924 1.94L487.32 155.87l-131.402 73.08-12.264-139.69-65.41 140.336-86.435-214.06h-.003zM45.503 44.095L39.355 75.94 154.285 218h.002l-77.6-166.836-31.185-7.07zm422.27 24.776l-31.184 7.07-43.738 107.37 81.068-82.59-6.147-31.85zM279.208 403.61c-40.176 0-72.708 32.537-72.708 72.71 0 5.725.636 10.706 1.887 16.05 7.25-32.545 36.097-56.655 70.82-56.655 34.82 0 63.673 23.97 70.82 56.656 1.218-5.277 1.888-10.404 1.888-16.05 0-40.175-32.536-72.71-72.71-72.71z"/></svg>`
        )
    }

    #getNumberCellContent(number: number): string {

        const colors: Record<number, string> = {
            1: '#0332fe',
            2: '#019f02',
            3: '#ff2600',
            4: '#93208f',
            5: '#ff7f29',
            6: '#ff3fff',
            7: '#53b8b4',
            8: '#22ee0f'
        }
        const color = colors[number] || ''
        return `<span style="color:${color};" class="number">${number}</span>`
    }

}