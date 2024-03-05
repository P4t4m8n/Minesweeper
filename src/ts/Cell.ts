import { CellModel } from "../models/Cell.model"

export class Cell implements CellModel {

    minesAround: number
    isShown: boolean
    isMine: boolean
    isMarked: boolean
    htmlStr: string

    constructor(svg = '', minesAround = 0, isShown = false, isMine = false, isMarked = false) {
        this.minesAround = minesAround
        this.isShown = isShown
        this.isMine = isMine
        this.isMarked = isMarked
        this.htmlStr = svg
    }

    //Getters

    getMine(): boolean {
        return this.isMine
    }
    getShown(): boolean {
        return this.isShown
    }
    getMarked(): boolean {
        return this.isMarked
    }
    getMinesAround(): number {
        return this.minesAround
    }

    getHtmlStr(): string {
        return this.htmlStr
    }


    //Setters

    setMine(): void {
        this.isMine = !this.isMine
    }

    setMarked(): void {
        this.isMarked = !this.isMarked
    }

    setShown(): void {
        this.isShown = !this.isShown
    }

    setMinesAround(mines: number): void {
        this.minesAround = mines
    }

    setHtmlStr(str: string): void {
        this.htmlStr = str
    }
}