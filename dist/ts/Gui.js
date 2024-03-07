import { HtmlStorage } from "./HtmlStorage.js";
import { Timer } from "./Timer.js";
export class Gui {
    static renderBoard(size) {
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
    static renderCells(els, game, htmlStr, isContext = false, isHint = false) {
        els.forEach(el => {
            var _a, _b;
            const row = parseInt((_a = el.getAttribute('data-row')) !== null && _a !== void 0 ? _a : '');
            const col = parseInt((_b = el.getAttribute('data-col')) !== null && _b !== void 0 ? _b : '');
            const cell = game.getCellInstance({ row, col });
            let str = htmlStr ? htmlStr : cell.htmlStr;
            Gui.renderCell(str, { row, col }, isContext, isHint);
        });
    }
    static renderCell(renderType, coords, isContext = false, isHint = false) {
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
    static renderHints() {
        const elHints = document.querySelector('.hint-con');
        if (!elHints)
            return;
        const svgChildren = elHints.querySelectorAll('button');
        svgChildren.forEach((svgChild, idx) => {
            let newSvgContent = HtmlStorage.getLightBulbSvg(idx.toString());
            svgChild.innerHTML = newSvgContent;
        });
    }
    static renderUI(selector, value) {
        const el = document.querySelector(selector);
        if (typeof value === 'string') {
            el.innerHTML = value;
        }
        else {
            el.innerText = value.toString();
        }
    }
    static renderScoreBoard(scores, el) {
        const elSCoreBoard = document.querySelector('dialog');
        let strHtml = scores.map(score => `<section class="score">
            <h2>${score.name}</2><h2>${Timer.getTime(score.time)}</h2>
            </section>`)
            .join('');
        strHtml += `<button class="dialog-close">Close</button>`;
        this.renderUI('dialog', strHtml);
        elSCoreBoard === null || elSCoreBoard === void 0 ? void 0 : elSCoreBoard.showModal();
    }
}
