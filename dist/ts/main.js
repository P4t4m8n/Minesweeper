import { Game } from "./Game.js";
document.addEventListener('DOMContentLoaded', () => onInit());
function onInit() {
    let game = new Game();
    handleEventListeners(game);
}
function handleEventListeners(game) {
    const elRestartBtn = document.querySelector('.restart');
    elRestartBtn.addEventListener('click', () => game.restart());
    const elSizeBtns = document.querySelectorAll('.size-btn');
    elSizeBtns.forEach((el, idx) => {
        ++idx;
        el.addEventListener('click', (ev) => onLevelChange(ev, game, 4 * idx));
    });
}
function onLevelChange(ev, game, size) {
    ev.preventDefault();
    let mines = _getMinesAmount(size);
    game.restart(size, mines);
}
function _getMinesAmount(size) {
    let mines;
    switch (size) {
        case 8:
            mines = 14;
            break;
        case 12:
            mines = 32;
            break;
        default:
            mines = 2;
            break;
    }
    return mines;
}
