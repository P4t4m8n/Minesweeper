import { CoordsModel } from "../models/Cell.model"
import { ScoreModel } from "../models/Score.model"
import { Game } from "./Game.js"
import { HtmlStorage } from "./HtmlStorage.js"
import { Timer } from "./Timer.js"

export class Gui {

    static renderBoard(size: number): void {
        const elBoard = document.querySelector('.board-container') as HTMLDivElement

        const strHtml = Array.from({ length: size }, (_, rowIdx) =>
            Array.from({ length: size }, (_, colIdx) =>
                `<div class="cell covered" data-row="${rowIdx}" data-col="${colIdx}"><span> </span></div>`
            )
        )

        if (elBoard) {
            // Use 1rem for cells in small screens
            const cellSize = window.innerWidth <= 500 ? '1.5rem' : '1fr'
            elBoard.style.gridTemplateColumns = `repeat(${size}, ${cellSize})`
            elBoard.style.gridTemplateRows = `repeat(${size}, ${cellSize})`

            elBoard.innerHTML = strHtml.flat().join("")
        }
    }

    static renderCells(els: NodeListOf<Element>, game: Game, htmlStr?: string | undefined, isContext = false, isHint = false): void {

        els.forEach(el => {
            const row = parseInt(el.getAttribute('data-row') ?? '')
            const col = parseInt(el.getAttribute('data-col') ?? '')
            const cell = game.getCellInstance({ row, col })

            let str = htmlStr ? htmlStr : cell.htmlStr
            Gui.renderCell(str, { row, col }, isContext, isHint)
        })
    }

    static renderCell(renderType: string, coords: CoordsModel, isContext = false, isHint = false) {

        const { row, col } = coords

        const elCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLDivElement
        if (!elCell) {
            console.error(`Cell not found for row ${row}, col ${col}`)
            return
        }

        let elSpan = elCell.querySelector('span') as HTMLSpanElement

        if (isHint) {
            elCell.classList.toggle('covered')
            elCell.classList.toggle('un-covered')
        }

        else if (!isContext) {
            elCell.classList.remove('covered')
            elCell.classList.add('un-covered')
        }

        elCell.classList.remove('safe')

        elSpan.innerHTML = renderType
    }

    static renderHints(): void {
        const elHints = document.querySelector('.hint-con') as HTMLDivElement
        if (!elHints) return

        const svgChildren = elHints.querySelectorAll('button')

        svgChildren.forEach((svgChild, idx) => {
            let newSvgContent = HtmlStorage.getLightBulbSvg(idx.toString())
            svgChild.innerHTML = newSvgContent
        })
    }

    static renderUI(selector: string, value: number | string): void {
        const el = document.querySelector(selector) as HTMLSpanElement

        if (typeof value === 'string') {
            el.innerHTML = value
        } else {
            el.innerText = value.toString()
        }

    }
    static renderScoreBoard(scores: Array<ScoreModel>, el: HTMLDialogElement) {
        const elSCoreBoard = document.querySelector('dialog')

        let strHtml = scores.map(score =>
            `<section class="score">
            <h2>${score.name}</2><h2>${Timer.getTime(score.time)}</h2>
            </section>`)
            .join('')

        strHtml += `<button class="dialog-close">Close</button>`

        this.renderUI('dialog', strHtml)
        elSCoreBoard?.showModal()

    }


}