import { Game } from "./Game.js";
document.addEventListener('DOMContentLoaded', () => onInit());
function onInit() {
    let game = new Game();
    renderBoard(4);
    handleEventListeners(game);
}
function handleEventListeners(game) {
    const elRestartBtn = document.querySelector('.restart');
    elRestartBtn.addEventListener('click', (ev) => onRestart(ev, game, game.getSize(), game.getMines()));
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
        // Use 1rem for cells in small screens
        const cellSize = window.innerWidth <= 500 ? '1.5rem' : '1fr';
        elBoard.style.gridTemplateColumns = `repeat(${size}, ${cellSize})`;
        elBoard.style.gridTemplateRows = `repeat(${size}, ${cellSize})`;
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
function renderHints() {
    const elHints = document.querySelector('.hints');
    if (!elHints)
        return;
    const svgChildren = elHints.querySelectorAll('svg');
    const newSvgContent = _getLightBulbSvg();
    svgChildren.forEach(svgChild => {
        svgChild.innerHTML = newSvgContent;
    });
}
function renderUI(selector, value) {
    const el = document.querySelector(selector);
    if (typeof value === 'string') {
        el.innerHTML = value;
    }
    else {
        el.innerText = value.toString();
    }
}
//EVENTS
function onCellClick(ev, game) {
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
        gameStart(game, { row, col });
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
        renderUI('.life', lifes);
        renderType = _getBombSvg();
    }
    else if (cell.getMinesAround() > 0) {
        cell.setShown();
        renderType = _getNumberHtml(cell.getMinesAround());
        showCount += 1;
        game.setShowCount(showCount);
    }
    else {
        _expandShown(row, col, game);
        showCount = game.getShowCount();
    }
    renderCell(renderType, row, col);
    renderUI('.shown', showCount);
    let isWin = game.checkWin();
    if (isWin)
        _gameOver(isWin, game);
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
    renderUI('.marked', markedCount);
    let isWin = game.checkWin();
    if (isWin)
        _gameOver(isWin, game);
}
function onLevelChange(ev, game, size) {
    ev.preventDefault();
    let mines = _getMinesAmount(size);
    onRestart(ev, game, size, mines);
    renderBoard(size);
}
function onRestart(ev, game, size, mines) {
    ev.preventDefault();
    game.restart(size, mines);
    renderBoard(size);
    renderUI('.life', 0);
    renderUI('.shown', 0);
    renderUI('.marked', 0);
    renderUI('.restart-svg', _getSmileySvg());
}
function onHint() {
}
//Methods
function gameStart(game, coords) {
    game.startGame(coords);
    let lifes = game.getLifes();
    renderUI('.life', lifes);
    renderUI('.restart-svg', _getWorriedSmiley());
    renderHints();
}
function _gameOver(isWin, game) {
    if (isWin) {
        alert('Win');
        renderUI('.restart-svg', _getHappySMileySvg());
    }
    else {
        alert('Lose');
        _revealMines(game.getBoard());
        renderUI('.restart-svg', _getSadSmileySvg());
    }
    game.gameOver(isWin);
}
function _expandShown(rowIdx, colIdx, game) {
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
function _revealNeighbours(row, col, game) {
}
function _revealMines(board) {
    board.board.forEach((row, rowIdx) => row.forEach((cell, colIdx) => {
        if (cell.getMine() && !cell.getShown()) {
            cell.setShown();
            renderCell(_getBombSvg(), rowIdx, colIdx);
        }
    }));
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
//SVGS
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
function _getSmileySvg() {
    return (`<svg class="restart-svg" viewBox="0 0 24 16" preserveAspectRatio="xMinYMin" class="jam jam-smiley">
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
    <path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-3.92-4.606a1 1 0 1 1 1.84-.788 2.264 2.264 0 0 0 4.16 0 1 1 0 1 1 1.84.788 4.264 4.264 0 0 1-7.84 0zM7 6a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V7a1 1 0 0 1 1-1z"></path></g>
    </svg>`);
}
function _getWorriedSmiley() {
    return (`<svg class="restart-svg" viewBox="0 0 256 220" >
        <g id="SVGRepo_bgCarrier" ></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <path d="M76,108a16,16,0,1,1,16,16A16.00016,16.00016,0,0,1,76,108Zm88-16a16,16,0,1,0,16,16A16.00016,16.00016,0,0,0,164,92Zm72,36A108,108,0,1,1,128,20,108.12217,108.12217,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.0953,84.0953,0,0,0,212,128Zm-44,20H88a12,12,0,0,0,0,24h80a12,12,0,0,0,0-24Z"></path> </g>
        </svg>`);
}
function _getSadSmileySvg() {
    return (`<svg  viewBox="0 0 256 220" >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <path d="M128,20A108,108,0,1,0,236,128,108.12186,108.12186,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09562,84.09562,0,0,1,128,212ZM76,108a16,16,0,1,1,16,16A16.00016,16.00016,0,0,1,76,108Zm104,0a16,16,0,1,1-16-16A16.00016,16.00016,0,0,1,180,108Zm-5.41113,54.18652a12,12,0,1,1-18.62793,15.13282,36.0032,36.0032,0,0,0-55.92237.001A12.0002,12.0002,0,1,1,81.41016,162.1875a60.0038,60.0038,0,0,1,93.17871-.001Z"></path> </g>
        </svg>`);
}
function _getHappySMileySvg() {
    return (`  <svg class="restart-svg" viewBox="0 0 128 90">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <g> <path d="M90.547,15.518C69.859-5.172,36.199-5.172,15.515,15.513C-5.172,36.198-5.17,69.858,15.517,90.547 c20.682,20.684,54.342,20.684,75.028-0.004C111.23,69.858,111.228,36.2,90.547,15.518z M84.758,84.758 c-17.494,17.494-45.961,17.496-63.456,0.002c-17.498-17.497-17.496-45.966,0-63.46C38.797,3.807,67.262,3.805,84.76,21.302 C102.254,38.796,102.252,67.265,84.758,84.758z M33.24,38.671c0-3.424,2.777-6.201,6.201-6.201c3.422,0,6.199,2.776,6.199,6.201 c0,3.426-2.777,6.202-6.199,6.202C36.017,44.873,33.24,42.097,33.24,38.671z M61.357,38.671c0-3.424,2.779-6.201,6.203-6.201 s6.201,2.776,6.201,6.201c0,3.426-2.777,6.202-6.201,6.202S61.357,42.097,61.357,38.671z M76.017,62.068 c-2.512,5.805-7.23,10.254-13.006,12.652v3.94c0,5.295-4.471,9.587-9.982,9.587c-5.511,0-9.98-4.292-9.98-9.587v-3.932 c-5.863-2.405-10.594-6.885-13.023-12.734c-0.637-1.529,0.09-3.285,1.619-3.921c0.377-0.155,0.766-0.229,1.15-0.229 c1.176,0,2.291,0.695,2.771,1.85c2.777,6.686,9.654,11.004,17.523,11.004c7.689,0,14.527-4.321,17.42-11.011 c0.658-1.521,2.424-2.222,3.944-1.563C75.974,58.781,76.675,60.548,76.017,62.068z"></path> </g> </g>
        </svg>`);
}
function _getLightBulbSvg() {
    return (`<svg viewBox="0 0 24 24" >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <path d="M10.063 8.5C10.0219 8.34019 10 8.17265 10 8C10 6.89543 10.8954 6 12 6C12.1413 6 12.2792 6.01466 12.4122 6.04253M5.6 21H18.4C18.9601 21 19.2401 21 19.454 20.891C19.6422 20.7951 19.7951 20.6422 19.891 20.454C20 20.2401 20 19.9601 20 19.4V18.6C20 18.0399 20 17.7599 19.891 17.546C19.7951 17.3578 19.6422 17.2049 19.454 17.109C19.2401 17 18.9601 17 18.4 17H5.6C5.03995 17 4.75992 17 4.54601 17.109C4.35785 17.2049 4.20487 17.3578 4.10899 17.546C4 17.7599 4 18.0399 4 18.6V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21ZM17 14V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V14H17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
        </svg>`);
}
function _getLightBulbActiveSvg() {
    return (`<svg viewBox="0 0 24 24" >
        <g id="SVGRepo_bgCarrier" stroke-width="0">
        </g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <path fill="yellow" d="M10.063 8.5C10.0219 8.34019 10 8.17265 10 8C10 6.89543 10.8954 6 12 6C12.1413 6 12.2792 6.01466 12.4122 6.04253M5 4L3 3M19 4L21 3M4 10H3M21 10H20M5.6 21H18.4C18.9601 21 19.2401 21 19.454 20.891C19.6422 20.7951 19.7951 20.6422 19.891 20.454C20 20.2401 20 19.9601 20 19.4V18.6C20 18.0399 20 17.7599 19.891 17.546C19.7951 17.3578 19.6422 17.2049 19.454 17.109C19.2401 17 18.9601 17 18.4 17H5.6C5.03995 17 4.75992 17 4.54601 17.109C4.35785 17.2049 4.20487 17.3578 4.10899 17.546C4 17.7599 4 18.0399 4 18.6V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21ZM17 14V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V14H17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
        </svg>`);
}
