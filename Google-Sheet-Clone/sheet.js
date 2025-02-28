document.querySelector('.new-sheet').addEventListener('click', createNewSheet);

// It will create new sheet
function createNewSheet(event){
    let newCellStateObject = {};
    for(let i = 1; i<=100; i++){
        for(let j = 65; j<=90; j++){
            let key = String.fromCharCode(j) + i;
            newCellStateObject[key] = {...initialCellState};
        }
    }

    if(activeSheetIndex != -1){
        document.getElementById('s'+(activeSheetIndex+1)).classList.remove('active-sheet');
    }

    sheetsArray.push(newCellStateObject);
    let n = sheetsArray.length;
    activeSheetIndex = n-1;
    activeSheetObject = sheetsArray[activeSheetIndex];

    // sheet menu
    let sheetMenu = document.createElement('div');
    sheetMenu.className = 'sheet-menu active-sheet';
    sheetMenu.id = 's' + n;
    sheetMenu.innerText = 'Sheet ' + n;

    // sheet navigation functionlity on click
    sheetMenu.addEventListener('click', (event) => {
        event.stopPropagation();

        document.getElementById('s'+(activeSheetIndex+1)).classList.remove('active-sheet');
        sheetMenu.classList.add('active-sheet');

        activeSheetIndex = Number(event.target.id.slice(1))-1;
        if(sheetsArray[activeSheetIndex] == activeSheetObject){
            activeCell.focus();
            return;
        }
        activeSheetObject = sheetsArray[activeSheetIndex];
        changeSheet();
    })

    // add sheetMenu to the footer
    document.querySelector('.footer').append(sheetMenu);

    // reflecting the current object data i each and every cell
    changeSheet();
}

// Put the active sheets value in all cells
function changeSheet(){
    // cell style reset
    for(let key in activeSheetObject){
        let cell = document.getElementById(key);
        let thisCell = activeSheetObject[key];

        cell.innerText = thisCell.content;
        cell.style.fontFamily = thisCell.fontFamily_data;
        cell.style.fontSize = thisCell.fontSize_data;
        cell.style.fontWeight = thisCell.isBold? '600':'400';
        cell.style.fontStyle = thisCell.isItalic? 'italic':'normal';
        cell.style.textDecoration = thisCell.isUnderlined? 'underline':'none';
        cell.style.textAlign = thisCell.textAlign;
        cell.style.color = thisCell.color;
        cell.style.backgroundColor = thisCell.backgroundColor;
    }

    // make the header fuctionality default
    resetFunctionality();
}

// reset all active functionality
function resetFunctionality(){
    let activeBg = '#c9c8c8';
    let inactiveBg = '#ecf0f1';
    
    activeCell = false;
    addressBar.innerHTML = 'Null';
    fontFamilyBtn.value = initialCellState.fontFamily_data;
    fontSizeBtn.value = initialCellState.fontSize_data;
    boldBtn.style.backgroundColor = inactiveBg;
    italicBtn.style.backgroundColor = inactiveBg;
    underlineBtn.style.backgroundColor = inactiveBg;
    setAlignmentBg(false, activeBg, inactiveBg);
    colorBtn.value = initialCellState.color;
    bgColorBtn.value = initialCellState.backgroundColor;
    formula.value = '';
}


// Create first sheet
createNewSheet();
// createNewSheet();
// createNewSheet();

// activating the sheet 1
// document.getElementById('s1').click();


// This assumes your cells have a `data-row` and `data-column` attribute or similar
document.addEventListener('keydown', (event) => {
    console.log("happen");
    console.log(event.key)
    console.log(activeCell)
    if (event.key === 'Enter' || activeCell) {
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