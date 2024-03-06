export class Cell {
    constructor(htmlStr, coords, minesAround = 0, isShown = false, isMine = false, isMarked = false) {
        this._minesAround = minesAround;
        this._isShown = isShown;
        this._isMine = isMine;
        this._isMarked = isMarked;
        this._htmlStr = htmlStr;
        this._coords = coords;
    }
    clone() {
        return new Cell(this._htmlStr, this._coords, this._minesAround, this._isShown, this._isMine, this._isMarked);
    }
    //Getters
    get isMine() {
        return this._isMine;
    }
    get isShown() {
        return this._isShown;
    }
    get isMarked() {
        return this._isMarked;
    }
    get MinesAround() {
        return this._minesAround;
    }
    get htmlStr() {
        return this._htmlStr;
    }
    get coords() {
        return this._coords;
    }
    //Setters
    set isMine(isMine) {
        this._isMine = isMine;
    }
    set isMarked(isMarked) {
        this._isMarked = isMarked;
    }
    set isShown(isShown) {
        this._isShown = isShown;
    }
    set MinesAround(mines) {
        if (mines < 0)
            return;
        this._minesAround = mines;
    }
    set htmlStr(str) {
        this._htmlStr = str;
    }
}
