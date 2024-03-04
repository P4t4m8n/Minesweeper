import { Game } from "./Game.js";
document.addEventListener('DOMContentLoaded', () => onInit());
function onInit() {
    let boardSize = 4;
    let minesCount = 2;
    let game = new Game(boardSize, minesCount);
    const elRestartBtn = document.querySelector('.restart');
    elRestartBtn.addEventListener('click', () => game.restart());
}
