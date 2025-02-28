const initialCellState = {
    fontFamily_data: 'monospace',
    fontSize_data: '14',
    isBold: false,
    isItalic: false,
    textAlign: 'start',
    isUnderlined: false,
    color: '#000000',
    backgroundColor: '#ffffff',
    content: ''
}

let sheetsArray = [];

let activeSheetIndex = -1;

let activeSheetObject = false;

let activeCell = false;


// functionality elments
let fontFamilyBtn = document.querySelector('.font-family');
let fontSizeBtn = document.querySelector('.font-size');
let boldBtn = document.querySelector('.bold');
let italicBtn = document.querySelector('.italic');
let underlineBtn = document.querySelector('.underline');
let leftBtn = document.querySelector('.start');
let centerBtn = document.querySelector('.center');
let rightBtn = document.querySelector('.end');
let colorBtn = document.querySelector('#color');
let bgColorBtn = document.querySelector('#bgcolor');
let addressBar = document.querySelector('.address-bar');
let formula = document.querySelector('.formula-bar');
let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");
let avg=document.querySelector("#my_avg");

// grid header ro element
let gridHeader = document.querySelector('.grid-header');



// add header column
let bold = document.createElement('div');
bold.className = 'grid-header-col';
bold.innerText = 'SL. NO.';
gridHeader.append(bold);
for(let i = 65; i<=90; i++){
    let bold = document.createElement('div');
    bold.className = 'grid-header-col';
    bold.innerText = String.fromCharCode(i);
    bold.id = String.fromCharCode(i);
    gridHeader.append(bold);
}


let isMouseDown = false;
let selectedCells = new Set();
let startCell = null;

function selectCell(cell) {
    if (!selectedCells.has(cell)) {
        cell.classList.add("selected");
        selectedCells.add(cell);
    }
}

function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove("selected"));
    selectedCells.clear();
}

for (let i = 1; i <= 100; i++) {
    let newRow = document.createElement("div");
    newRow.className = "row";
    document.querySelector(".grid").append(newRow);

    let bold = document.createElement("div");
    bold.className = "grid-cell";
    bold.innerText = i;
    bold.id = i;
    newRow.append(bold);

    for (let j = 65; j <= 90; j++) {
        let cell = document.createElement("div");
        cell.className = "grid-cell cell-focus";
        cell.id = String.fromCharCode(j) + i;
        cell.contentEditable = true;
        cell.dataset.row = i;
        cell.dataset.col = String.fromCharCode(j); // Store A-Z

        // Enable Editing on Single Click
        cell.addEventListener("click", (event) => {
            if (!isMouseDown) {
                clearSelection(); // Clear selection if editing
                event.target.focus();
            }
        });

        // Start Selection on Mouse Down (only if not focused)
        cell.addEventListener("mousedown", (event) => {
            if (document.activeElement !== cell) {
                event.preventDefault();
                isMouseDown = true;
                startCell = cell;
                clearSelection();
                selectCell(cell);
            }
        });

        // Enable Multi-Selection on Mouse Over
        cell.addEventListener("mouseover", (event) => {
            if (isMouseDown) {
                selectCell(event.target);
            }
        });

        // Stop Selection on Mouse Up
        document.addEventListener("mouseup", () => {
            isMouseDown = false;
        
            // Collect and log all selected cell values
            let selectedValues = [];
            selectedCells.forEach(cell => {
                selectedValues.push({
                    id: cell.id,   // Example: "A1", "B3"
                    value: cell.innerText.trim() // Text inside the cell
                });
            });
        
            // console.log(selectedValues);
            

        });        

        newRow.append(cell);
    }
}


function cellFocus(event){
    console.log("hp2");
    let key = event.target.id;
    addressBar.innerHTML = event.target.id;
    activeCell = event.target;

    let activeBg = '#c9c8c8';
    let inactiveBg = '#ecf0f1';

    fontFamilyBtn.value = activeSheetObject[key].fontFamily_data;
    fontSizeBtn.value = activeSheetObject[key].fontSize_data;
    boldBtn.style.backgroundColor = activeSheetObject[key].isBold?activeBg:inactiveBg;
    italicBtn.style.backgroundColor = activeSheetObject[key].isItalic?activeBg:inactiveBg;
    underlineBtn.style.backgroundColor = activeSheetObject[key].isUnderlined?activeBg:inactiveBg;
    setAlignmentBg(key, activeBg, inactiveBg);
    colorBtn.value = activeSheetObject[key].color;
    bgColorBtn.value = activeSheetObject[key].backgroundColor;

    formula.value = activeCell.innerText;

    document.getElementById(event.target.id.slice(0, 1)).classList.add('row-col-focus');
    document.getElementById(event.target.id.slice(1)).classList.add('row-col-focus');
}
function cellInput(){
    let key = activeCell.id;
    formula.value = activeCell.innerText;
    activeSheetObject[key].content = activeCell.innerText;
}
function setAlignmentBg(key, activeBg, inactiveBg){
    leftBtn.style.backgroundColor = inactiveBg;
    centerBtn.style.backgroundColor = inactiveBg;
    rightBtn.style.backgroundColor = inactiveBg;
    if(key){
        document.querySelector('.'+ activeSheetObject[key].textAlign).style.backgroundColor = activeBg;
    }
    else{
        leftBtn.style.backgroundColor = activeBg;
    }
}
function cellFocusOut(event){
    document.getElementById(event.target.id.slice(0, 1)).classList.remove('row-col-focus');
    document.getElementById(event.target.id.slice(1)).classList.remove('row-col-focus');
}


// This assumes your cells have a `data-row` and `data-column` attribute or similar
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && activeCell) {
        console.log("occur");
        event.preventDefault(); // Prevent the default action (like form submission)

        // Get current row and column
        const currentRow = parseInt(activeCell.dataset.row, 10); // assuming you have data-row on each cell
        const currentColumn = parseInt(activeCell.dataset.column, 10); // assuming you have data-column on each cell

        // Find the next cell in the same column, but the next row
        const nextRow = currentRow + 1;

        // Find the cell in the next row, same column
        const nextCell = document.querySelector(`[dataset-row="${nextRow}"][dataset-column="${currentColumn}"]`);

        if (nextCell) {
            activeCell = nextCell;
            nextCell.focus();  // Focus on the next cell
        }
    }
});

// Make sure to assign data-row and data-column to each cell when rendering them
// Example HTML structure for a cell:
// <div class="cell" data-row="1" data-column="1">Cell content</div>
