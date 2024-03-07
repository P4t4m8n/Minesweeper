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
import { Gui } from "./Gui.js";
import { HtmlStorage } from "./HtmlStorage.js";
const CLICK = 'click';
const CONTEXTMENU = 'contextmenu';
const DB_URL = 'https://mine-sweeper-766b3.firebaseio.com/';
document.addEventListener('DOMContentLoaded', () => onInit());
function onInit() {
    const game = new Game();
    Gui.renderBoard(4);
    handleEventListeners(game);
    Gui.renderHints();
    onRenderScoreBoard();
}
//EVENTS
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
    if (game.isManualMines && game.placedMines > 0) {
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
        handleRevealNeighbors(coords, game, cell);
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
        game.life = game.life - 1;
        Gui.renderUI('.life', game.life);
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
    Gui.renderCell(cell.htmlStr, coords);
    Gui.renderUI('.shown', showCount);
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
        renderType = HtmlStorage.getMarkedSvg();
        cell.isMarked = true;
    }
    Gui.renderCell(renderType, coords, true);
    Gui.renderUI('.marked', game.markedCount);
    let isWin = game.checkWin();
    if (isWin)
        gameOver(isWin, game);
}
function onLevelChange(ev, game, size) {
    ev.preventDefault();
    let mines = getMinesAmount(size);
    onRestart(ev, game, size, mines);
    Gui.renderBoard(size);
}
function onRestart(ev, game, size, mines) {
    ev.preventDefault();
    game.restart(size, mines);
    Gui.renderBoard(size);
    Gui.renderUI('.life', game.life);
    Gui.renderUI('.shown', game.shownCount);
    Gui.renderUI('.marked', game.markedCount);
    Gui.renderUI('.restart-svg', HtmlStorage.getSmileySvg());
}
function onHint(game, idx) {
    let newHintCount = game.hintCount;
    Gui.renderUI(`.hint${idx}`, HtmlStorage.getLightBulbActiveSvg());
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
    Gui.renderUI('.safe-click-txt', HtmlStorage.getHintsHtml(game.safeClicks));
}
function onManuallyCreate(game) {
    game.isManualMines = true;
    game.placedMines = game.mines;
}
function onUndo(ev, game) {
    ev.preventDefault();
    game.undo();
    Gui.renderBoard(game.size);
    game.board.board.forEach((row, rowIdx) => row.forEach((cell, colIdx) => {
        if (cell.isShown)
            Gui.renderCell(cell.htmlStr, { row: rowIdx, col: colIdx });
    }));
    Gui.renderUI('.shown', game.shownCount);
    Gui.renderUI('.marked', game.markedCount);
    Gui.renderUI('.life', game.life);
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
function onRenderScoreBoard() {
    return __awaiter(this, void 0, void 0, function* () {
        const DB_URL = 'https://mine-sweeper-766b3.firebaseio.com/';
        try {
            const scoreBoard = yield FirebaseService.fetchData('score/');
            console.log("scoreBoard:", scoreBoard);
            Gui.renderBoard(scoreBoard);
        }
        catch (err) {
            console.log(err);
        }
    });
}
//Methods
function gameStart(game, coords) {
    game.startGame(coords);
    let life = game.life;
    Gui.renderUI('.life', life);
    Gui.renderUI('.restart-svg', HtmlStorage.getWorriedSmiley());
    Gui.renderUI('.safe-click-txt', HtmlStorage.getHintsHtml(game.safeClicks));
}
function gameOver(isWin, game) {
    if (isWin) {
        alert('Win');
        Gui.renderUI('.restart-svg', HtmlStorage.getHappySMileySvg());
    }
    else {
        alert('Lose');
        revealMines(game.board);
        Gui.renderUI('.restart-svg', HtmlStorage.getSadSmileySvg());
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
            Gui.renderCell(htmlStr, { row: newRow, col: newCol });
            if (minesAround === 0) {
                queue.push({ row: newRow, col: newCol });
            }
        }
    }
}
function handleRevealNeighbors(coords, game, cell) {
    revealNeighbors(coords, game, cell);
    setTimeout(revealNeighbors, 1500, coords, game, cell, '<span> </span>');
}
function revealNeighbors(coords, game, cell, htmlStr = '') {
    Gui.renderCell(htmlStr || cell.htmlStr, coords, false, true);
    const board = game.board;
    board.neighborsLoop(coords, (cell, row, col) => {
        if (cell.isShown)
            return;
        let HtmlToRender = htmlStr ? htmlStr : cell.htmlStr;
        Gui.renderCell(HtmlToRender, { row, col }, false, true);
    });
}
function handleMegaHint(game, cell, coords) {
    let megaHintCount = game.megaHintsCount;
    if (megaHintCount <= 0) {
        const elHighLights = document.querySelectorAll('.highlight');
        Gui.renderCells(elHighLights, game, undefined, false, true);
        setTimeout(Gui.renderCells, 1500, elHighLights, game, '<span> </span>', false, true);
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
            Gui.renderCell(cell.htmlStr, { row: rowIdx, col: colIdx });
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
