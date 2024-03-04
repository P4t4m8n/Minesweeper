
import { Game } from "./Game.js"

document.addEventListener('DOMContentLoaded', () => onInit())

function onInit(): void {

    let game = new Game()
    handleEventListeners(game)

}

function handleEventListeners(game: Game): void {

    const elRestartBtn = document.querySelector('.restart') as HTMLButtonElement
    elRestartBtn.addEventListener('click', () => game.restart())

    const elSizeBtns = document.querySelectorAll('.size-btn') as NodeList
    elSizeBtns.forEach((el, idx) => {
        ++idx
        el.addEventListener('click', (ev) =>
            onLevelChange(ev, game, 4 * idx))
    })
}

function onLevelChange(ev: Event, game: Game, size: number) {
    ev.preventDefault()

    let mines = _getMinesAmount(size)
    game.restart(size, mines)

}

function _getMinesAmount(size: number): number {
    let mines: number

    switch (size) {

        case 8:
            mines = 14
            break

        case 12:
            mines = 32
            break

        default:
            mines = 2
            break
    }

    return mines
}


