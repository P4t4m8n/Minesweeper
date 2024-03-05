export class Cell {
    constructor(minesAround = 0, isShown = false, isMine = false, isMarked = false) {
        this.minesAround = minesAround;
        this.isShown = isShown;
        this.isMine = isMine;
        this.isMarked = isMarked;
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
}
