var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FirebaseService } from "./FirebaseService.js";
import { Game } from "./Game.js";
const CLICK = 'click';
const CONTEXTMENU = 'contextmenu';
const DB_URL = 'https://mine-sweeper-766b3.firebaseio.com/';
document.addEventListener('DOMContentLoaded', () => onInit());
function onInit() {
    let game = new Game();
    renderBoard(4);
    handleEventListeners(game);
    renderHints();
    renderScoreBoard();
}
function handleEventListeners(game) {
    const elRestartBtn = document.querySelector('.restart');
    EventManager.addEventListener(elRestartBtn, CLICK, onRestart, game, game.size, game.mines);
    const elSizeBtns = document.querySelectorAll('.size-btn');
    elSizeBtns.forEach((elBtn, idx) => {
        ++idx;
        let size = 4 * idx;
        EventManager.addEventListener(elBtn, CLICK, onLevelChange, game, size);
    });
    const elBoard = document.querySelector('.board-container');
    if (elBoard) {
        EventManager.addEventListener(elBoard, CLICK, onCellClick, game);
        EventManager.addEventListener(elBoard, CONTEXTMENU, onContextClick, game);
    }
    const elHints = document.querySelector('.hint-con');
    const elHintsBtns = elHints.querySelectorAll('button');
    elHintsBtns.forEach((button, idx) => EventManager.addEventListener(button, CLICK, onHint, game, idx));
    const elSafeClickBtn = document.querySelector('.safe-click button');
    EventManager.addEventListener(elSafeClickBtn, CLICK, onSafeClick, game);
    const elManuallyCreateBtn = document.querySelector('.manually-create');
    EventManager.addEventListener(elManuallyCreateBtn, CLICK, onManuallyCreate, game);
    const elUndoBtn = document.querySelector('.undo');
    EventManager.addEventListener(elUndoBtn, CLICK, onUndo, game);
    const elDarkBtn = document.querySelector('.toggle-dark');
    EventManager.addEventListener(elDarkBtn, CLICK, onToggleDarkMode);
    const elMegaHintBtn = document.querySelector('.mega-hint');
    EventManager.addEventListener(elMegaHintBtn, CLICK, onMegaHint, game);
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
function renderCells(els, game, htmlStr, isContext = false, isHint = false) {
    els.forEach(el => {
        var _a, _b;
        const row = parseInt((_a = el.getAttribute('data-row')) !== null && _a !== void 0 ? _a : '');
        const col = parseInt((_b = el.getAttribute('data-col')) !== null && _b !== void 0 ? _b : '');
        const cell = game.getCellInstance({ row, col });
        let str = htmlStr ? htmlStr : cell.htmlStr;
        renderCell(str, { row, col }, isContext, isHint);
    });
}
function renderCell(renderType, coords, isContext = false, isHint = false) {
    const { row, col } = coords;
    const elCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!elCell) {
        console.error(`Cell not found for row ${row}, col ${col}`);
        return;
    }
    let elSpan = elCell.querySelector('span');
    if (isHint) {
        elCell.classList.toggle('covered');
        elCell.classList.toggle('un-covered');
    }
    else if (!isContext) {
        elCell.classList.remove('covered');
        elCell.classList.add('un-covered');
    }
    elCell.classList.remove('safe');
    elSpan.innerHTML = renderType;
}
function renderHints() {
    const elHints = document.querySelector('.hint-con');
    if (!elHints)
        return;
    const svgChildren = elHints.querySelectorAll('button');
    svgChildren.forEach((svgChild, idx) => {
        let newSvgContent = _getLightBulbSvg(idx.toString());
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
function renderScoreBoard() {
    return __awaiter(this, void 0, void 0, function* () {
        const DB_URL = 'https://mine-sweeper-766b3.firebaseio.com/';
        try {
            const scoreBoard = yield FirebaseService.fetchData('score/');
            console.log("scoreBoard:", scoreBoard);
            const elSCoreBoard = document.querySelector('.score-board-con');
        }
        catch (err) {
            console.log(err);
        }
    });
}
//EVENTS
function onCellClick(ev, game) {
    ev.preventDefault();
    ev.stopPropagation();
    const target = ev.target;
    if (!target.classList.contains('cell'))
        return;
    const rowStr = target.getAttribute('data-row');
    const colStr = target.getAttribute('data-col');
    if (!rowStr || !colStr)
        return;
    const row = parseInt(rowStr);
    const col = parseInt(colStr);
    const coords = { row, col };
    if (game.isManuallMines && game.placedMines > 0) {
        return manuallyPlaceMines(game, coords);
    }
    if (game.placedMines === 0) {
        removeClasses('.mine-placed');
    }
    if (!game.isOn) {
        gameStart(game, coords);
    }
    const cell = game.getCellInstance(coords);
    if (cell.isShown || cell.isMarked)
        return;
    if (game.isHint) {
        handleRevealNeighbours(coords, game, cell);
        game.isHint = false;
        return;
    }
    if (game.isMegaHint) {
        handleMegaHint(game, cell, coords);
        return;
    }
    game.saveMove();
    let showCount = game.shownCount;
    if (cell.isMine) {
        game.lifes = game.lifes - 1;
        renderUI('.life', game.lifes);
        if (game.checkLose())
            return gameOver(!game.checkLose(), game);
    }
    else if (cell.MinesAround > 0) {
        cell.isShown = true;
        showCount += 1;
        game.shownCount = showCount;
    }
    else {
        expandShown(coords, game);
        showCount = game.shownCount;
    }
    renderCell(cell.htmlStr, coords);
    renderUI('.shown', showCount);
    let isWin = game.checkWin();
    if (isWin)
        gameOver(isWin, game);
}
function onContextClick(ev, game) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!game.isOn)
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
    const coords = { row, col };
    const cell = game.getCellInstance(coords);
    if (cell.isShown)
        return;
    const isMarked = cell.isMarked;
    let renderType = `<span> </span>`;
    if (isMarked) {
        game.markedCount = game.markedCount - 1;
        cell.isMarked = false;
    }
    else {
        if (game.markedCount >= game.mines)
            return alert('Max flags');
        game.markedCount = game.markedCount + 1;
        renderType = _getMarkedSvg();
        cell.isMarked = true;
    }
    renderCell(renderType, coords, true);
    renderUI('.marked', game.markedCount);
    let isWin = game.checkWin();
    if (isWin)
        gameOver(isWin, game);
}
function onLevelChange(ev, game, size) {
    ev.preventDefault();
    let mines = getMinesAmount(size);
    onRestart(ev, game, size, mines);
    renderBoard(size);
}
function onRestart(ev, game, size, mines) {
    ev.preventDefault();
    game.restart(size, mines);
    renderBoard(size);
    renderUI('.life', game.lifes);
    renderUI('.shown', game.shownCount);
    renderUI('.marked', game.markedCount);
    renderUI('.restart-svg', _getSmileySvg());
}
function onHint(game, idx) {
    let newHintCount = game.hintCount;
    renderUI(`.hint${idx}`, _getLightBulbActiveSvg());
    if (newHintCount <= 0)
        return;
    newHintCount -= 1;
    game.hintCount = newHintCount;
    game.isHint = true;
}
function onSafeClick(game) {
    if (!game.isOn)
        return;
    const cell = game.safeClick();
    if (typeof cell === 'string')
        return alert(cell);
    const { row, col } = cell.coords;
    const elCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    elCell.classList.add('safe');
    renderUI('.safe-click-txt', getHintsHtml(game.safeClicks));
}
function onManuallyCreate(game) {
    game.isManuallMines = true;
    game.placedMines = game.mines;
}
function onUndo(ev, game) {
    ev.preventDefault();
    game.undo();
    renderBoard(game.size);
    game.board.board.forEach((row, rowIdx) => row.forEach((cell, colIdx) => {
        if (cell.isShown)
            renderCell(cell.htmlStr, { row: rowIdx, col: colIdx });
    }));
    renderUI('.shown', game.shownCount);
    renderUI('.marked', game.markedCount);
    renderUI('.life', game.lifes);
}
function onToggleDarkMode() {
    var _a;
    (_a = document.querySelector('body')) === null || _a === void 0 ? void 0 : _a.classList.toggle('dark-mode');
    const elBtn = document.querySelector('.toggle-dark');
    elBtn.innerText = (elBtn.innerText === 'Dark Mode') ? 'Normal Mode' : 'Dark Mode';
}
function onMegaHint(game) {
    if (!game.isOn)
        return;
    game.isMegaHint = true;
}
//Methods
function gameStart(game, coords) {
    game.startGame(coords);
    let lifes = game.lifes;
    renderUI('.life', lifes);
    renderUI('.restart-svg', _getWorriedSmiley());
    renderUI('.safe-click-txt', getHintsHtml(game.safeClicks));
}
function gameOver(isWin, game) {
    if (isWin) {
        alert('Win');
        renderUI('.restart-svg', _getHappySMileySvg());
    }
    else {
        alert('Lose');
        revealMines(game.board);
        renderUI('.restart-svg', _getSadSmileySvg());
    }
    game.gameOver(isWin);
}
function expandShown(coords, game) {
    const { row: rowIdx, col: colIdx } = coords;
    const queue = [{ row: rowIdx, col: colIdx }];
    while (queue.length > 0) {
        const { row, col } = queue.shift();
        const expandedCells = game.expandShown(row, col);
        for (const { htmlStr, row: newRow, col: newCol, minesAround } of expandedCells) {
            renderCell(htmlStr, { row: newRow, col: newCol });
            if (minesAround === 0) {
                queue.push({ row: newRow, col: newCol });
            }
        }
    }
}
function handleRevealNeighbours(coords, game, cell) {
    revealNeighbours(coords, game, cell);
    setTimeout(revealNeighbours, 1500, coords, game, cell, '<span> </span>');
}
function revealNeighbours(coords, game, cell, htmlStr = '') {
    renderCell(htmlStr || cell.htmlStr, coords, false, true);
    const board = game.board;
    board.neighborsLoop(coords, (cell, row, col) => {
        if (cell.isShown)
            return;
        let HtmlToRender = htmlStr ? htmlStr : cell.htmlStr;
        renderCell(HtmlToRender, { row, col }, false, true);
    });
}
function handleMegaHint(game, cell, coords) {
    let megaHintCount = game.megaHintsCount;
    if (megaHintCount <= 0) {
        const elHighLights = document.querySelectorAll('.highlight');
        renderCells(elHighLights, game, undefined, false, true);
        setTimeout(renderCells, 1500, elHighLights, game, '<span> </span>', false, true);
        clearMegaHint(game, coords);
        return;
    }
    const startCoords = cell.coords;
    const elCells = document.querySelectorAll('.cell');
    elCells.forEach((elCell) => {
        EventManager.addEventListener(elCell, 'mouseenter', onCellHover, startCoords);
    });
    if (megaHintCount > 0)
        game.megaHintsCount = 0;
}
const EventManager = (function () {
    const listeners = new Map();
    function addEventListener(el, type, handler, ...args) {
        const wrappedHandler = (ev) => handler(ev, ...args);
        if (!listeners.has(el)) {
            listeners.set(el, new Map());
        }
        const elementListeners = listeners.get(el);
        elementListeners.set(type, { originalHandler: handler, wrappedHandler });
        el.addEventListener(type, wrappedHandler);
    }
    function removeEventListener(el, type) {
        const elementListeners = listeners.get(el);
        if (elementListeners && elementListeners.has(type)) {
            const { wrappedHandler } = elementListeners.get(type);
            el.removeEventListener(type, wrappedHandler);
            elementListeners.delete(type);
        }
    }
    return {
        addEventListener,
        removeEventListener
    };
})();
function onCellHover(ev, coords) {
    var _a, _b;
    const target = ev.target;
    const row = parseInt((_a = target.getAttribute('data-row')) !== null && _a !== void 0 ? _a : '');
    const col = parseInt((_b = target.getAttribute('data-col')) !== null && _b !== void 0 ? _b : '');
    if (isNaN(row) || isNaN(col))
        return;
    highlightCells(row, col, coords);
}
function highlightCells(hoverRow, hoverCol, coords) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        var _a, _b;
        const row = parseInt((_a = cell.getAttribute('data-row')) !== null && _a !== void 0 ? _a : '');
        const col = parseInt((_b = cell.getAttribute('data-col')) !== null && _b !== void 0 ? _b : '');
        const isBetween = isCellBetween(coords.row, coords.col, hoverRow, hoverCol, row, col);
        if (isBetween) {
            cell.classList.add('highlight');
        }
        else {
            cell.classList.remove('highlight');
        }
    });
}
function isCellBetween(startRow, startCol, endRow, endCol, cellRow, cellCol) {
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    return cellRow >= minRow && cellRow <= maxRow && cellCol >= minCol && cellCol <= maxCol;
}
function clearMegaHint(game, coords) {
    removeClasses('.highlight');
    const elCells = document.querySelectorAll('.cell');
    elCells.forEach((elCell) => EventManager.removeEventListener(elCell, 'mouseenter'));
    game.isMegaHint = false;
}
function revealMines(board) {
    board.board.forEach((row, rowIdx) => row.forEach((cell, colIdx) => {
        if (cell.isMine && !cell.isShown) {
            cell.isShown = true;
            renderCell(cell.htmlStr, { row: rowIdx, col: colIdx });
        }
    }));
}
function manuallyPlaceMines(game, coords) {
    game.placeMine(coords);
    const elCell = document.querySelector(`[data-row="${coords.row}"][data-col="${coords.col}"]`);
    elCell.classList.add('mine-placed');
}
function getMinesAmount(size) {
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
function removeClasses(className) {
    const elCells = document.querySelectorAll(className);
    let shortClassName = className.substring(1);
    elCells.forEach(elCell => elCell.classList.remove(shortClassName));
}
//SVGS and Html
function _getMarkedSvg() {
    return (`<svg  viewBox="0 0 24 24" ><g  stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <path d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`);
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
function _getLightBulbSvg(idx = '') {
    return (`<svg class=hint hint${idx} viewBox="0 0 24 24" >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <path d="M10.063 8.5C10.0219 8.34019 10 8.17265 10 8C10 6.89543 10.8954 6 12 6C12.1413 6 12.2792 6.01466 12.4122 6.04253M5.6 21H18.4C18.9601 21 19.2401 21 19.454 20.891C19.6422 20.7951 19.7951 20.6422 19.891 20.454C20 20.2401 20 19.9601 20 19.4V18.6C20 18.0399 20 17.7599 19.891 17.546C19.7951 17.3578 19.6422 17.2049 19.454 17.109C19.2401 17 18.9601 17 18.4 17H5.6C5.03995 17 4.75992 17 4.54601 17.109C4.35785 17.2049 4.20487 17.3578 4.10899 17.546C4 17.7599 4 18.0399 4 18.6V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21ZM17 14V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V14H17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
        </svg>`);
}
function _getLightBulbActiveSvg() {
    return (`<svg class=hint viewBox="0 0 24 24" >
        <g id="SVGRepo_bgCarrier" stroke-width="0">
        </g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> <path fill="yellow" d="M10.063 8.5C10.0219 8.34019 10 8.17265 10 8C10 6.89543 10.8954 6 12 6C12.1413 6 12.2792 6.01466 12.4122 6.04253M5 4L3 3M19 4L21 3M4 10H3M21 10H20M5.6 21H18.4C18.9601 21 19.2401 21 19.454 20.891C19.6422 20.7951 19.7951 20.6422 19.891 20.454C20 20.2401 20 19.9601 20 19.4V18.6C20 18.0399 20 17.7599 19.891 17.546C19.7951 17.3578 19.6422 17.2049 19.454 17.109C19.2401 17 18.9601 17 18.4 17H5.6C5.03995 17 4.75992 17 4.54601 17.109C4.35785 17.2049 4.20487 17.3578 4.10899 17.546C4 17.7599 4 18.0399 4 18.6V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21ZM17 14V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V14H17Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
        </svg>`);
}
function getHintsHtml(amount) {
    return (`${amount} Remines`);
}
