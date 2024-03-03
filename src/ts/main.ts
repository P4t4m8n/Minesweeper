
import { Game } from "./Game.js"

document.addEventListener('DOMContentLoaded', () => onInit())

function onInit(): void {


    const boardSize = 4
    const minesCount = 2
    const game = new Game(boardSize,minesCount)

}


