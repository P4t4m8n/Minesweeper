export class Cell {
    constructor(svg = '', minesAround = 0, isShown = false, isMine = false, isMarked = false) {
        this.minesAround = minesAround;
        this.isShown = isShown;
        this.isMine = isMine;
        this.isMarked = isMarked;
        this.htmlStr = svg;
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
