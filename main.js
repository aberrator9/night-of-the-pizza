const mapArea = document.querySelector('.map-area');
const healthDisplay = document.getElementById('health');
const cashDisplay = document.getElementById('cash');
const vibesDisplay = document.getElementById('vibes');
const message = document.querySelector('.message');

const chars = {
    'player': 'P', 'wall': '█', 'street': '▒', 'empty': '░', 'dogSmall': 'd', 'dogBig': 'D',
    'house': 'H', 'cash': '$', 'vibesUp': '^', 'vibesDown': 'v', 'healthUp': '+', 'healthDown': 'x',
    'meter': '⯀', 'meterEmpty': '⬚'
};

// Helpers
function between(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function betweenFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomCoords(grid) {
    return [Math.floor(Math.random() * grid.length), Math.floor(Math.random() * grid[0].length)];
}

class Message {
    static clear() { message.textContent = ''; }
    static show(msg) { message.textContent = msg; }
}

// Grid generation
const CELLS = {
    EMPTY: 0,
    BOUNDARY: 1,
    CASH: 2,
    HEALTH: 3,
    VIBES: 4,
    STREET: 5,
    HOUSE: 6,
};

function createDataGrid(rows, cols) {
    const grid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            if (y > 0 && y < rows - 1 && x > 0 && x < cols - 1) {
                row.push(CELLS.EMPTY);
            } else {
                row.push(CELLS.BOUNDARY);
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

class Entity {
    constructor(y, x, amt) {
        this.y = y;
        this.x = x;
        this.amt = amt;
    }
}

function seedMap() {
    const streetDensity = 0.2;
    const numStreets = Math.floor(Math.min(dataGrid.length, dataGrid[0].length) * streetDensity);
    console.log("Number of streets: " + numStreets);

    // Streets
    let vert = true;
    for (let s = 0; s < numStreets * 2; ++s) {
        let randPos = vert === true ? between(0, dataGrid.length) : between(0, dataGrid[0].length);
        for (let i = 0; i < (vert === true ? dataGrid.length : dataGrid[0].length); ++i) {
            if (vert) {
                updateDataAtCoord(dataGrid, [i, randPos], CELLS.STREET);
            } else {
                updateDataAtCoord(dataGrid, [randPos, i], CELLS.STREET);
            }
        }
        vert = !vert;
    }

    // Houses


    // Testing
    for (let c = 0; c < 25; ++c) {
        const randYX = randomCoords(dataGrid);
        updateDataAtCoord(dataGrid, randYX, CELLS.CASH);
    }
    for (let c = 0; c < 5; ++c) {
        const randYX = randomCoords(dataGrid);
        updateDataAtCoord(dataGrid, randYX, CELLS.HEALTH);
    }
    for (let c = 0; c < 5; ++c) {
        const randYX = randomCoords(dataGrid);
        updateDataAtCoord(dataGrid, randYX, CELLS.VIBES);
    }
}

// View generation
function createViewGridFromDataGrid(dataGrid) {
    const grid = [];
    for (let y = 0; y < dataGrid.length; y++) {
        const row = [];
        for (let x = 0; x < dataGrid[y].length; x++) {
            if (dataGrid[y][x] === CELLS.EMPTY) {
                row.push(chars['empty']);
            } else if (dataGrid[y][x] === CELLS.BOUNDARY) {
                row.push(chars['wall']);
            } else if (dataGrid[y][x] === CELLS.CASH) {
                row.push(chars['cash']);
            } else if (dataGrid[y][x] === CELLS.HEALTH) {
                row.push(chars['healthDown']);
            } else if (dataGrid[y][x] === CELLS.VIBES) {
                row.push(chars['vibesDown']);
            } else if (dataGrid[y][x] === CELLS.STREET) {
                row.push(chars['street']);
            }
        }
        grid.push(row);
    }
    return grid;
}

// Player
class Player {
    constructor(startY, startX, health, cash, vibes) {
        this.x = startX;
        this.y = startY;
        this.health = health;
        this.cash = cash;
        this.vibes = vibes;

        updateViewGridAtCoord(viewGrid, [startY, startX], chars['player']);
    }

    move(y, x) {
        if (this.y + y < 0 || this.y + y >= viewGrid.length ||
            this.x + x < 0 || this.x + x >= viewGrid[0].length) {
            return;
        }

        const cellVal = dataGrid[this.y + y][this.x + x];
        if (cellVal === CELLS.BOUNDARY) {
            return;
        }

        updateViewGridAtCoord(viewGrid, [this.y, this.x], chars['empty']);

        this.y += y;
        this.x += x;

        if (cellVal === CELLS.EMPTY) {
            console.log("EMPTY")
        } else if (cellVal === CELLS.CASH) {
            const oldPlayerCash = player.cash;
            const newCash = betweenFloat(1, 20); // Generate a truncated random cash value
            player.cash += newCash;
            player.cash = +(player.cash).toFixed(2);
            Message.show(`Picked up $${+(player.cash - oldPlayerCash).toFixed(2)}`);
            updateDataAtCoord(dataGrid, [this.y, this.x], CELLS.EMPTY);
        } else if (cellVal === CELLS.HEALTH) {
            player.health = Math.min(Math.max(--player.health, 0), 10);
            Message.show('That hurt.')
        } else if (cellVal === CELLS.VIBES) {
            player.vibes = Math.min(Math.max(--player.vibes, 0), 10);
            Message.show('You want to go home.')
        }

        updateViewGridAtCoord(viewGrid, [this.y, this.x], chars['player']);
        refreshView();
    }
}

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

// View helpers
function updateViewGridAtCoord(grid, [y, x], newChar) {
    grid[y][x] = newChar;
}

function refreshView() {
    const mapContent = viewGrid.map(row => row.join('')).join('\n');
    mapArea.textContent = mapContent;
    cashDisplay.textContent = player.cash > 0 ? player.cash : 'broke';
    healthDisplay.textContent = player.health > 0 ? chars['meter'].repeat(player.health) + chars['meterEmpty'].repeat(10 - player.health) : 'dead';
    vibesDisplay.textContent = player.vibes > 0 ? chars['meter'].repeat(player.vibes) + chars['meterEmpty'].repeat(10 - player.vibes) : 'sad';
}

// Initialization
let dataGrid = [];
dataGrid = createDataGrid(between(10, 25), between(20, 50));

seedMap();

let viewGrid = [];
viewGrid = createViewGridFromDataGrid(dataGrid);

const player = new Player(between(1, viewGrid.length - 2), between(1, viewGrid[0].length - 2), 10, 0, 10);
refreshView();
Message.clear();