import { CoordsModel } from "../models/Cell.model"
export class Cell {

    private _minesAround: number
    private _isShown: boolean
    private _isMine: boolean
    private _isMarked: boolean
    private _htmlStr: string
    readonly _coords: CoordsModel

    constructor(htmlStr: string, coords: CoordsModel, minesAround = 0, isShown = false, isMine = false, isMarked = false) {
        this._minesAround = minesAround
        this._isShown = isShown
        this._isMine = isMine
        this._isMarked = isMarked
        this._htmlStr = htmlStr
        this._coords = coords
    }

    clone(): Cell {
        return new Cell(this._htmlStr, this._coords, this._minesAround, this._isShown, this._isMine, this._isMarked)
    }

    //Getters

    get isMine(): boolean {
        return this._isMine
    }

    get isShown(): boolean {
        return this._isShown
    }

    get isMarked(): boolean {
        return this._isMarked
    }

    get MinesAround(): number {
        return this._minesAround
    }

    get htmlStr(): string {
        return this._htmlStr
    }

    get coords(): CoordsModel {
        return this._coords
    }

    //Setters

    set isMine(isMine: boolean) {
        this._isMine = isMine
    }

    set isMarked(isMarked: boolean) {
        this._isMarked = isMarked
    }

    set isShown(isShown: boolean) {
        this._isShown = isShown
    }

    set MinesAround(mines: number) {
        if (mines < 0) return
        this._minesAround = mines
    }

    set htmlStr(str: string) {
        this._htmlStr = str
    }
}