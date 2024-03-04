
import { Game } from "./Game.js"

document.addEventListener('DOMContentLoaded', () => onInit())

function onInit(): void {


    let boardSize = 4
    let minesCount = 2

    let game = new Game(boardSize, minesCount)
    const elRestartBtn = document.querySelector('.restart') as HTMLButtonElement
    elRestartBtn.addEventListener('click', () => game.restart())
}


