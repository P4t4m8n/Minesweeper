import { HtmlStorage } from "./HtmlStorage.js";
export class Gui {
    static renderBoard(size) {
        const elBoard = document.querySelector('.board-container');
        if (!elBoard) {
            console.error('Board container not found');
            return;
        }
        // Create a document fragment to assemble the board off-DOM
        const boardFragment = document.createDocumentFragment();
        for (let rowIdx = 0; rowIdx < size; rowIdx++) {
            for (let colIdx = 0; colIdx < size; colIdx++) {
                const cell = document.createElement('div');
                cell.className = 'cell covered';
                cell.dataset.row = rowIdx.toString();
                cell.dataset.col = colIdx.toString();
                cell.setAttribute('role', 'button');
                cell.setAttribute('aria-label', `Cell at row ${rowIdx + 1}, column ${colIdx + 1}`);
                const span = document.createElement('span');
                cell.appendChild(span);
                boardFragment.appendChild(cell);
            }
        }
        // Set the grid style before appending children to minimize reflows
        Gui.setGridStyle(elBoard, size);
        // Clear existing board (if any) and append the new board in one operation
        elBoard.innerHTML = '';
        elBoard.appendChild(boardFragment);
    }
    static setGridStyle(el, size) {
        // Use 1rem for cells in small screens
        const cellSize = window.innerWidth <= 500 ? '1.5rem' : '1fr';
        el.style.gridTemplateColumns = `repeat(${size}, ${cellSize})`;
        el.style.gridTemplateRows = `repeat(${size}, ${cellSize})`;
    }
    static renderCells(els, game, htmlStr, isContext = false, isHint = false) {
        els.forEach(el => {
            var _a, _b;
            const rowStr = (_a = el.getAttribute('data-row')) !== null && _a !== void 0 ? _a : '';
            const colStr = (_b = el.getAttribute('data-col')) !== null && _b !== void 0 ? _b : '';
            if (!rowStr || !colStr) {
                console.error('Invalid cell coordinates');
                return;
            }
            const row = parseInt(rowStr);
            const col = parseInt(colStr);
            const cell = game.getCellInstance({ row, col });
            const content = htmlStr || cell.htmlStr;
            if (isHint) {
                if (cell.isShown)
                    return;
            }
            Gui.renderCell(content, { row, col }, isContext, isHint);
        });
    }
    static renderCell(renderType, coords, isContext = false, isHint = false) {
        const { row, col } = coords;
        const selector = `[data-row="${row}"][data-col="${col}"]`;
        const elCell = document.querySelector(selector);
        if (!elCell) {
            console.error(`Cell not found for row ${row}, col ${col}`);
            return;
        }
        Gui.updateCellClasses(elCell, isHint, isContext);
        let elSpan = elCell.querySelector('span');
        if (elSpan) {
            elSpan.textContent = renderType;
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
        console.log("value:", value);
        const el = document.querySelector(selector);
        if (typeof value === 'string') {
            el.innerHTML = value;
        }
        else {
            el.innerText = value.toString();
        }
    }
    static renderScoreBoard(scores, el) {
        let strHtml = scores.map((score, idx) => `<section class="score">
           <h2>${idx + 1} -</h2><h2>${score.name}</h2><h2>${score.time}</h2>
            </section>`)
            .join('');
        strHtml += `<button class="dialog-close">Close</button>`;
        this.renderUI('dialog', strHtml);
        el === null || el === void 0 ? void 0 : el.showModal();
    }
    static updateCellClasses(elCell, isHint, isContext) {
        if (isHint) {
            elCell.classList.toggle('covered');
            elCell.classList.toggle('un-covered');
        }
        else if (!isContext) {
            elCell.classList.remove('covered');
            elCell.classList.add('un-covered');
        }
        elCell.classList.remove('safe');
    }
}
