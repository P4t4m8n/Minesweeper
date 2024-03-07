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
        const el = document.querySelector(selector);
        if (typeof value === 'string') {
            el.innerHTML = value;
        }
        else {
            el.innerText = value.toString();
        }
    }
    static renderScoreBoard(scores, el) {
        if (!el) {
            console.error('Scoreboard dialog element not found');
            return;
        }
        // Create a document fragment to assemble the scoreboard
        const scoreboardFragment = document.createDocumentFragment();
        // Append score entries
        scores.forEach((score, idx) => {
            const scoreEntry = Gui.createScoreEntry(score, idx);
            scoreboardFragment.appendChild(scoreEntry);
        });
        // Append close button
        const closeButton = Gui.createCloseButton();
        scoreboardFragment.appendChild(closeButton);
        // Clear existing content and append the new scoreboard
        el.innerHTML = '';
        el.appendChild(scoreboardFragment);
        el.showModal();
    }
    static createScoreEntry(score, idx) {
        const section = document.createElement('section');
        section.className = 'score';
        const indexHeading = document.createElement('h2');
        indexHeading.textContent = `${idx + 1} -`;
        section.appendChild(indexHeading);
        const nameHeading = document.createElement('h2');
        nameHeading.textContent = score.name;
        section.appendChild(nameHeading);
        const timeHeading = document.createElement('h2');
        timeHeading.textContent = score.time;
        section.appendChild(timeHeading);
        return section;
    }
    static createCloseButton() {
        const button = document.createElement('button');
        button.className = 'dialog-close';
        button.textContent = 'Close';
        button.setAttribute('type', 'button');
        return button;
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
