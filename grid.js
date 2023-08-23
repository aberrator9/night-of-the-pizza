// Grid generation
function updateViewAtCoord(grid, [y, x], newChar) {
    grid[y][x] = newChar;
}

function createDataGrid(rows, cols) {
    const grid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            if (y > 0 && y < rows - 1 && x > 0 && x < cols - 1) {
                row.push(undefined);
            } else {
                row.push(undefined);
            }
        }
        grid.push(row);
    }
    console.log(grid);
    return grid;
}

function createViewFromDataGrid(rows, cols) {
    const grid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            if (y > 0 && y < rows - 1 && x > 0 && x < cols - 1) {
                row.push(emptyChar);
            } else {
                row.push(wallChar);
            }
        }
        grid.push(row);
    }
    return grid;
}