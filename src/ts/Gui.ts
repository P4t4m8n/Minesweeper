import { CoordsModel } from "../models/Cell.model"
import { Game } from "./Game.js"
import { HtmlStorage } from "./HtmlStorage.js"
export class Gui {

    static renderBoard(size: number): void {
        const elBoard = document.querySelector('.board-container') as HTMLDivElement

        if (!elBoard) {
            console.error('Board container not found')
            return
        }

        // Create a document fragment to assemble the board off-DOM
        const boardFragment = document.createDocumentFragment()

        for (let rowIdx = 0; rowIdx < size; rowIdx++) {
            for (let colIdx = 0; colIdx < size; colIdx++) {
                const cell = document.createElement('div')
                cell.className = 'cell covered'
                cell.dataset.row = rowIdx.toString()
                cell.dataset.col = colIdx.toString()
                cell.setAttribute('role', 'button')
                cell.setAttribute('aria-label', `Cell at row ${rowIdx + 1}, column ${colIdx + 1}`)
                const span = document.createElement('span')
                cell.appendChild(span)
                boardFragment.appendChild(cell)
            }
        }

        // Set the grid style before appending children to minimize reflows
        Gui.setGridStyle(elBoard, size)

        // Clear existing board (if any) and append the new board in one operation
        elBoard.innerHTML = ''
        elBoard.appendChild(boardFragment)
    }

    static setGridStyle(el: HTMLDivElement, size: number) {

        // Use 1rem for cells in small screens
        const cellSize = window.innerWidth <= 500 ? '1.5rem' : '1fr'

        el.style.gridTemplateColumns = `repeat(${size}, ${cellSize})`
        el.style.gridTemplateRows = `repeat(${size}, ${cellSize})`
    }

    static renderCells(els: NodeListOf<Element>, game: Game, htmlStr?: string | undefined, isContext = false, isHint = false): void {

        els.forEach(el => {
            const rowStr = el.getAttribute('data-row') ?? ''
            const colStr = el.getAttribute('data-col') ?? ''

            if (!rowStr || !colStr) {
                console.error('Invalid cell coordinates')
                return
            }

            const row = parseInt(rowStr)
            const col = parseInt(colStr)
            const cell = game.getCellInstance({ row, col })
            const content = htmlStr || cell.htmlStr

            if (isHint) {
                if (cell.isShown) return
            }

            Gui.renderCell(content, { row, col }, isContext, isHint)
        })
    }

    static renderCell(renderType: string, coords: CoordsModel, isContext = false, isHint = false) {

        const { row, col } = coords
        const selector = `[data-row="${row}"][data-col="${col}"]`

        const elCell = document.querySelector(selector) as HTMLDivElement
        if (!elCell) {
            console.error(`Cell not found for row ${row}, col ${col}`)
            return
        }

        Gui.updateCellClasses(elCell, isHint, isContext)

        let elSpan = elCell.querySelector('span') as HTMLSpanElement
        if (elSpan) {
            elSpan.textContent = renderType
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

    static renderScoreBoard(scores: Array<{ name: string, time: string }>, el: HTMLDialogElement): void {
        if (!el) {
            console.error('Scoreboard dialog element not found');
            return
        }

        // Create a document fragment to assemble the scoreboard
        const scoreboardFragment = document.createDocumentFragment()

        // Append score entries
        scores.forEach((score, idx) => {
            const scoreEntry = Gui.createScoreEntry(score, idx)
            scoreboardFragment.appendChild(scoreEntry)
        })

        // Append close button
        const closeButton = Gui.createCloseButton()
        scoreboardFragment.appendChild(closeButton)

        // Clear existing content and append the new scoreboard
        el.innerHTML = ''
        el.appendChild(scoreboardFragment)

        el.showModal()
    }

    static createScoreEntry(score: { name: string, time: string }, idx: number): HTMLElement {

        const section = document.createElement('section')
        section.className = 'score'

        const indexHeading = document.createElement('h2')
        indexHeading.textContent = `${idx + 1} -`
        section.appendChild(indexHeading)

        const nameHeading = document.createElement('h2')
        nameHeading.textContent = score.name
        section.appendChild(nameHeading)

        const timeHeading = document.createElement('h2')
        timeHeading.textContent = score.time
        section.appendChild(timeHeading);

        return section
    }

    static createCloseButton(): HTMLElement {

        const button = document.createElement('button')

        button.className = 'dialog-close'
        button.textContent = 'Close'
        button.setAttribute('type', 'button')

        return button
    }

    static updateCellClasses(elCell: HTMLDivElement, isHint: boolean, isContext: boolean): void {

        if (isHint) {
            elCell.classList.toggle('covered')
            elCell.classList.toggle('un-covered')

        } else if (!isContext) {
            elCell.classList.remove('covered')
            elCell.classList.add('un-covered')
        }

        elCell.classList.remove('safe')
    }
}