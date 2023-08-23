const mapArea = document.querySelector('.map-area');
const healthDisplay = document.getElementById('health');
const cashDisplay = document.getElementById('cash');
const vibesDisplay = document.getElementById('vibes');

const playerChar = 'P';
const wallChar = '█';
const streetChar = '▒';
const smallDogChar = 'd';
const emptyChar = '░';
const houseChar = 'H';
const cashChar = '$';
let house = [];
let numHouses = between(5, 10);

// Helpers
function between(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCoords(grid) {
    return [Math.floor(Math.random() * grid.length - 1), Math.floor(Math.random() * grid[0].length - 2)];
}

// Grid generation
function updateViewAtCoord(grid, [y, x], newChar) {
    grid[y][x] = newChar;
}

let dataGrid = [];
let viewGrid = [];

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
    return grid;
}

function createViewGrid(rows, cols) {
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

dataGrid = createDataGrid(between(10, 25), between(20, 50));
viewGrid = createViewGrid(dataGrid.length, dataGrid[0].length);

// Player initialization and movement
addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        player.move(-1, 0);
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        player.move(0, 1);
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        player.move(1, 0);
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        player.move(0, -1);
    }
});

class Player {
    constructor(startY, startX, health, cash, vibes) {
        this.x = startX;
        this.y = startY;
        this.health = health;
        this.cash = cash;
        this.vibes = vibes;

        updateViewAtCoord(viewGrid, [startY, startX], playerChar);
        updateDisplay();
    }

    move(y, x) {
        if (this.y + y < 0 || this.y + y >= viewGrid.length ||
            this.x + x < 0 || this.x + x >= viewGrid[0].length) {
            return;
        }

        updateViewAtCoord(viewGrid, [this.y, this.x], emptyChar);

        this.y += y;
        this.x += x;

        updateViewAtCoord(viewGrid, [this.y, this.x], playerChar);
        updateDisplay();
    }
}

const player = new Player(between(1, viewGrid.length - 2), between(1, viewGrid[0].length - 2), 10, 73.57, 10);

// Cash
class Cash {
    constructor(y, x, amt) {
        this.y = y;
        this.x = x;
        this.amt = amt;
    }

    collect() {
        return amt;
    }

    static init() {
        for (let c = 0; c < 4; ++c) {
            const randYX = randomCoords(dataGrid);
            // dataGrid[randYX.y].splice(randYX.x, 0, new Cash(randYX.y, randYX.x, 1));
            updateViewAtCoord(viewGrid, randYX, cashChar);
        }
    }
}

Cash.init();
updateDisplay();
cashDisplay.textContent = player.cash;

// Display
function updateViewAtCoord(grid, [y, x], newChar) {
    grid[y][x] = newChar;
}

function updateDisplay() {
    const mapContent = viewGrid.map(row => row.join('')).join('\n');
    mapArea.textContent = mapContent;
}