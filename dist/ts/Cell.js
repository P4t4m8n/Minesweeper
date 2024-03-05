export class Cell {
    constructor(svg = '', coords, minesAround = 0, isShown = false, isMine = false, isMarked = false) {
        this.minesAround = minesAround;
        this.isShown = isShown;
        this.isMine = isMine;
        this.isMarked = isMarked;
        this.htmlStr = svg;
        this.coords = coords;
    }
    //Getters
    getMine() {
        return this.isMine;
    }
    getShown() {
        return this.isShown;
    }
    getMarked() {
        return this.isMarked;
    }
    getMinesAround() {
        return this.minesAround;
    }
    getHtmlStr() {
        return this.htmlStr;
    }
    getCoords() {
        return this.coords;
    }
    //Setters
    setMine() {
        this.isMine = !this.isMine;
    }
    setMarked() {
        this.isMarked = !this.isMarked;
    }
    setShown() {
        this.isShown = !this.isShown;
    }
    setMinesAround(mines) {
        this.minesAround = mines;
    }
    setHtmlStr(str) {
        this.htmlStr = str;
    }
}
