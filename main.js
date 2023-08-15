const mapArea = document.querySelector('.map-area');
const playerChar = 'P';
const wallChar = '█';
const streetChar = '▒';
const smallDogChar = 'd';
const emptyChar = '░';
const houseChar = 'H';
let house = [];
let numHouses = between(5, 10);

let grid = [];

function between(min, max) {
    return Math.floor(Math.random() * max + min);
}

function randomCoords(height, width) {
    return [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
}

function createGrid(rows, cols) {
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

function replaceCoordinate(grid, y, x, newChar) {
    grid[y][x] = newChar;
}

grid = createGrid(between(10, 25), between(20, 50));
replaceCoordinate(grid, between(1, grid.length), between(1, grid[0].length), playerChar);

// Generate the HTML content for the map
const mapContent = grid.map(row => row.join('')).join('\n');
mapArea.innerHTML = mapContent;
