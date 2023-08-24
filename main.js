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

function betweenCash(min, max) {
    return +(Math.random() * (max - min + 1) + min).toFixed(2);
}

function randomCoords(grid) {
    return [Math.floor(Math.random() * grid.length - 1), Math.floor(Math.random() * grid[0].length - 2)];
}

// Grid generation
const CELLS = {
    EMPTY: 0,
    WALL: 1,
    CASH: 2
};

let dataGrid = [];
function createDataGrid(rows, cols) {
    const grid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            if (y > 0 && y < rows - 1 && x > 0 && x < cols - 1) {
                row.push(CELLS.EMPTY);
            } else {
                row.push(CELLS.WALL);
            }
        }
        grid.push(row);
    }
    console.log(grid);
    return grid;
}

function updateDataAtCoord(grid, [y, x], newType) {
    grid[y][x] = newType;
}

dataGrid = createDataGrid(between(10, 25), between(20, 50));

// Cash
class Cash {
    constructor(y, x, amt) {
        this.y = y;
        this.x = x;
        this.amt = amt;
    }

    static random() {
        return betweenCash(1, 20);
    }

    static init() {
        for (let c = 0; c < 4; ++c) {
            const randYX = randomCoords(dataGrid);
            updateDataAtCoord(dataGrid, randYX, CELLS.CASH);
        }
    }
}
Cash.init();

// View generation
let viewGrid = [];

function createViewGridFromDataGrid(dataGrid) {
    const grid = [];
    for (let y = 0; y < dataGrid.length; y++) {
        const row = [];
        for (let x = 0; x < dataGrid[y].length; x++) {
            if (dataGrid[y][x] === CELLS.EMPTY) {
                row.push(emptyChar);
            } else if (dataGrid[y][x] === CELLS.WALL) {
                row.push(wallChar);
            } else if (dataGrid[y][x] === CELLS.CASH) {
                row.push(cashChar);
            }
        }
        grid.push(row);
    }
    return grid;
}

viewGrid = createViewGridFromDataGrid(dataGrid);

// Player initialization and movement
class Player {
    constructor(startY, startX, health, cash, vibes) {
        this.x = startX;
        this.y = startY;
        this.health = health;
        this.cash = cash;
        this.vibes = vibes;

        updateViewAtCoord(viewGrid, [startY, startX], playerChar);
    }

    move(y, x) {
        if (this.y + y < 0 || this.y + y >= viewGrid.length ||
            this.x + x < 0 || this.x + x >= viewGrid[0].length) {
            return;
        }

        updateViewAtCoord(viewGrid, [this.y, this.x], emptyChar);

        this.y += y;
        this.x += x;
        // console.log(this.y, this.x);

        const cellVal = dataGrid[this.y][this.x];
        console.log(cellVal);

        if (cellVal === CELLS.EMPTY) {
            console.log("EMPTY")
        }
        if (cellVal === CELLS.CASH) {
            console.log("CASH");
            this.cash += Cash.random();

            updateDataAtCoord(dataGrid, [this.y, this.x], CELLS.EMPTY);
        }
        if (cellVal === CELLS.WALL) {
            console.log("wall");
        }

        updateViewAtCoord(viewGrid, [this.y, this.x], playerChar);
        refreshView();
    }
}

const player = new Player(between(1, viewGrid.length - 2), between(1, viewGrid[0].length - 2), 10, 73.57, 10);
cashDisplay.textContent = player.cash;

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

refreshView();

// View
function updateViewAtCoord(grid, [y, x], newChar) {
    grid[y][x] = newChar;
}

function refreshView() {
    const mapContent = viewGrid.map(row => row.join('')).join('\n');
    mapArea.textContent = mapContent;
    cashDisplay.textContent = player.cash;
}