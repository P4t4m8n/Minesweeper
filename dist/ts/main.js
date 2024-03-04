import { Game } from "./Game.js";
document.addEventListener('DOMContentLoaded', () => onInit());
function onInit() {
    let game = new Game();
    renderBoard(4);
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
    const elBoard = document.querySelector('.board-container');
    if (elBoard) {
        elBoard.addEventListener('click', (ev) => onCellClick(ev, game));
        elBoard.addEventListener('contextmenu', (ev) => onContextClick(ev, game));
    }
}
//RENDERS
function renderBoard(size) {
    const elBoard = document.querySelector('.board-container');
    const strHtml = Array.from({ length: size }, (_, rowIdx) => Array.from({ length: size }, (_, colIdx) => `<div class="cell covered" data-row="${rowIdx}" data-col="${colIdx}"><span> </span></div>`));
    if (elBoard) {
        elBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        elBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        elBoard.innerHTML = strHtml.flat().join("");
    }
}
function renderCell(renderType, row, col, isContext = false) {
    const elCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!elCell) {
        console.error(`Cell not found for row ${row}, col ${col}`);
        return;
    }
    let elSpan = elCell.querySelector('span');
    if (!isContext) {
        elCell.classList.remove('covered');
        elCell.classList.add('un-covered');
    }
    elSpan.innerHTML = renderType;
}
function rednerLifes(lifes) {
    const elLifes = document.querySelector('.life');
    elLifes.innerText = lifes.toString();
}
function renderShown(shownCount) {
    const elShown = document.querySelector('.shown');
    elShown.innerText = shownCount.toString();
}
function renderMarked(marked) {
    const elMarked = document.querySelector('.marked');
    elMarked.innerText = marked.toString();
}
//EVENTS
function onCellClick(ev, game) {
    console.log("ev:", ev);
    ev.preventDefault();
    const target = ev.target;
    if (!target.classList.contains('cell'))
        return;
    const rowStr = target.getAttribute('data-row');
    const colStr = target.getAttribute('data-col');
    if (!rowStr || !colStr)
        return;
    const row = parseInt(rowStr);
    const col = parseInt(colStr);
    if (!game.getIsOn()) {
        game.startGame({ row, col });
        let lifes = game.getLifes();
        rednerLifes(lifes);
    }
    const cell = game.getCellInstance(row, col);
    let renderType = `<span>0</span>`;
    if (cell.getShown())
        return;
    if (cell.getMarked())
        return;
    let showCount = game.getShowCount();
    if (cell.getMine()) {
        let lifes = game.getLifes() - 1;
        game.setLifes(lifes);
        rednerLifes(lifes);
        renderType = _getBombSvg();
    }
    else if (cell.getMinesAround() > 0) {
        cell.setShown();
        renderType = _getNumberHtml(cell.getMinesAround());
        showCount += 1;
        game.setShowCount(showCount);
    }
    else {
        onExpandShown(row, col, game);
        showCount = game.getShowCount();
    }
    renderCell(renderType, row, col);
    renderShown(showCount);
    let isWin = game.checkWin();
    if (isWin)
        onGameOver(isWin, game);
}
function onContextClick(ev, game) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!game.getIsOn())
        return;
    let target = ev.target;
    if (target.nodeName !== 'DIV') {
        target = target.closest('.cell');
    }
    if (!target)
        return;
    const rowStr = target.getAttribute('data-row');
    const colStr = target.getAttribute('data-col');
    if (!rowStr || !colStr)
        return;
    const row = parseInt(rowStr);
    const col = parseInt(colStr);
    const cell = game.getCellInstance(row, col);
    if (cell.getShown())
        return;
    const isMarked = cell.getMarked();
    const markedCount = game.getMarkCount();
    let renderType = `<span> </span>`;
    if (isMarked)
        game.setMarkedCount(markedCount - 1);
    else {
        if (markedCount >= game.getMines())
            return alert('Max flags');
        game.setMarkedCount(markedCount + 1);
        renderType = _getMarkedSvg();
    }
    cell.setMarked();
    renderCell(renderType, row, col, true);
    renderMarked(markedCount);
    let isWin = game.checkWin();
    if (isWin)
        onGameOver(isWin, game);
}
function onExpandShown(rowIdx, colIdx, game) {
    const queue = [{ row: rowIdx, col: colIdx }];
    while (queue.length > 0) {
        const { row, col } = queue.shift();
        const expandedCells = game.expandShown(row, col);
        for (const { minesAround, row: newRow, col: newCol } of expandedCells) {
            renderCell(_getNumberHtml(minesAround), newRow, newCol);
            if (minesAround === 0) {
                queue.push({ row: newRow, col: newCol });
            }
        }
    }
}
function onLevelChange(ev, game, size) {
    ev.preventDefault();
    let mines = _getMinesAmount(size);
    game.restart(size, mines);
    renderBoard(size);
}
function onGameOver(isWin, game) {
    if (isWin)
        alert('Win');
    else {
        alert('Lose');
        _revealMines(game.getBoard());
    }
    game.gameOver(isWin);
}
//Util
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
function _getBombSvg() {
    return (`<svg class="bomb" viewBox="0 0 512 512"><path d="M287.586 15.297l3.504 110.963 31.537-110.963h-35.04zm-95.78.238l-1.75 236.047-170.533-43.33L130.486 377.69l-88.77-5.174 114.432 112.357-44.466-75.867L186.896 417l-51.748-109.94 110.114 79.956-12.635-185.23.002.003 75.212 170.57 75.816-89.95-6.62 154.582 60.173-39.978-20.388 79.486 75.756-142.787-75.924 1.94L487.32 155.87l-131.402 73.08-12.264-139.69-65.41 140.336-86.435-214.06h-.003zM45.503 44.095L39.355 75.94 154.285 218h.002l-77.6-166.836-31.185-7.07zm422.27 24.776l-31.184 7.07-43.738 107.37 81.068-82.59-6.147-31.85zM279.208 403.61c-40.176 0-72.708 32.537-72.708 72.71 0 5.725.636 10.706 1.887 16.05 7.25-32.545 36.097-56.655 70.82-56.655 34.82 0 63.673 23.97 70.82 56.656 1.218-5.277 1.888-10.404 1.888-16.05 0-40.175-32.536-72.71-72.71-72.71z"/></svg>`);
}
function _getMarkedSvg() {
    return (`<svg  viewBox="0 0 24 24" ><g  stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <path d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`);
}
function _getNumberHtml(number) {
    let color;
    switch (number) {
        case 1:
            color = '#0332fe';
            break;
        case 2:
            color = '#019f02';
            break;
        case 3:
            color = '#ff2600';
            break;
        case 4:
            color = '#93208f';
            break;
        case 5:
            color = '#ff7f29';
            break;
        case 6:
            color = '#ff3fff';
            break;
        case 7:
            color = '#53b8b4';
            break;
        case 8:
            color = '#22ee0f';
            break;
        default:
            color = '';
            break;
    }
    return `<span style="color:${color};" class="number">${number}</span>`;
}
function _revealMines(board) {
    board.board.forEach((row, rowIdx) => row.forEach((cell, colIdx) => {
        if (cell.getMine() && !cell.getShown()) {
            cell.setShown();
            renderCell(_getBombSvg(), rowIdx, colIdx);
        }
    }));
}
