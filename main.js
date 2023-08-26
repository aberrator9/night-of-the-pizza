const mapArea = document.querySelector('.map-area');
const healthDisplay = document.getElementById('health');
const cashDisplay = document.getElementById('cash');
const vibesDisplay = document.getElementById('vibes');
const message = document.querySelector('.message');

const cells = {
    meter: '⯀', 'meterEmpty': '⬚',
    health: ['+', 'x'], cash: '$', vibes: ['^', 'v'],
    empty: '░', boundary: '█', street: '▒',
    house: 'H',
    player: 'P',
    dogSmall: 'd',
    dogBig: 'D'
};

class Entity {
    constructor(cell, y, x, amt, tile) {
        this.y = y;
        this.x = x;
        this.amt = amt;
        this.cell = cell;
        this.tile = tile;
    }
}

// Helpers
function between(min, max) {
    return Math.max(0, Math.floor(Math.random() * (max - min) + min));
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
function createDataGrid(rows, cols) {
    const grid = [];
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            if (y > 0 && y < rows - 1 && x > 0 && x < cols - 1) {
                row.push(cells.empty);
            } else {
                row.push(cells.boundary);
            }
        }
        grid.push(row);
    }
    return grid;
}

function updateDataAtCoord(grid, [y, x], newType) {
    grid[y][x] = newType;
}

function seedMap() {
    // const streetDensity = 0.2;
    // const numStreets = Math.floor(Math.min(dataGrid.length, dataGrid[0].length) * streetDensity);
    const numVertical = 3;
    const numHorizontal = 3;

    // Space out vertical streets
    let positions = [];
    for (let v = 0; v < numVertical; ++v) {
        let randPos = -1;
        let isValid = false;

        while (randPos === -1 || !isValid) {
            randPos = between(3, dataGrid[0].length - 3);

            if (positions.length < 1) {
                positions.push(randPos);
                isValid = true;
                continue;
            }

            isValid = positions.every(element => {
                return (element === randPos || Math.abs(element - randPos) < 6) ? false : true;
            });

            if (isValid) {
                positions.push(randPos);
            }
        }
    }

    // Write to dataGrid
    for (let p = 0; p < positions.length; ++p) {
        for (let i = 0; i < dataGrid.length; ++i) {
            updateDataAtCoord(dataGrid, [i, positions[p]], cells.street);
        }
    }

    // Space out horizontal streets
    positions = [];
    for (let h = 0; h < numHorizontal; ++h) {
        let randPos = -1;
        let isValid = false;

        while (randPos === -1 || !isValid) {
            randPos = between(3, dataGrid.length - 3);

            if (positions.length < 1) {
                positions.push(randPos);
                isValid = true;
                continue;
            }

            isValid = positions.every(element => {
                return (element === randPos || Math.abs(element - randPos) < 3) ? false : true;
            });

            if (isValid) {
                positions.push(randPos);
            }
        }
    }

    // Write to dataGrid
    for (let p = 0; p < positions.length; ++p) {
        for (let i = 0; i < dataGrid[0].length; ++i) {
            updateDataAtCoord(dataGrid, [positions[p], i], cells.street);
        }
    }

    // for (let s = 0; s < numHorizontal; ++s) {
    //     randPos = between(3, dataGrid.length - 3);
    //     for (let i = 0; i < dataGrid[0].length; ++i) {
    //         updateDataAtCoord(dataGrid, [randPos, i], CELLS.STREET);
    //     }
    // }

    // Houses


    // Testing
    for (let c = 0; c < 25; ++c) {
        const randYX = randomCoords(dataGrid);
        updateDataAtCoord(dataGrid, randYX, cells.cash);
    }
    for (let c = 0; c < 5; ++c) {
        const randYX = randomCoords(dataGrid);
        updateDataAtCoord(dataGrid, randYX, cells.health);
    }
    for (let c = 0; c < 5; ++c) {
        const randYX = randomCoords(dataGrid);
        updateDataAtCoord(dataGrid, randYX, cells.vibes);
    }
}

// View generation
function createViewGridFromDataGrid(dataGrid) {
    const grid = [];
    for (let y = 0; y < dataGrid.length; y++) {
        const row = [];
        for (let x = 0; x < dataGrid[y].length; x++) {
            if (dataGrid[y][x] === cells.vibes) {
                row.push(dataGrid[y][x][1]);
            } else if (dataGrid[y][x] === cells.health) {
                row.push(dataGrid[y][x][1]);
            } else {
                row.push(dataGrid[y][x]);
            }
        }
        grid.push(row);
    }
    return grid;
}

// Player
class Player {
    constructor(startY, startX, health, cash, vibes, cell) {
        this.x = startX;
        this.y = startY;
        this.health = health;
        this.cash = cash;
        this.vibes = vibes;
        this.cell = dataGrid[startY, startX];

        updateViewGridAtCoord(viewGrid, [startY, startX], cells.player);
    }

    move(y, x) {
        if (this.y + y < 0 || this.y + y >= viewGrid.length ||
            this.x + x < 0 || this.x + x >= viewGrid[0].length) {
            return;
        }

        const cellVal = dataGrid[this.y + y][this.x + x];
        if (cellVal === cells.boundary) {
            return;
        }

        updateViewGridAtCoord(viewGrid, [this.y, this.x], cells.empty);

        this.y += y;
        this.x += x;

        this.cell = dataGrid[this.y, this.x];

        if (cellVal === cells.empty) {
            console.log("EMPTY")
        } else if (cellVal === cells.cash) {
            const oldPlayerCash = player.cash;
            const newCash = betweenFloat(1, 20); // Generate a truncated random cash value
            player.cash += newCash;
            player.cash = +(player.cash).toFixed(2);
            Message.show(`Picked up $${(player.cash - oldPlayerCash).toFixed(2)}` + '.');
            updateDataAtCoord(dataGrid, [this.y, this.x], player.cell);
        } else if (cellVal === cells.health) {
            player.health = Math.min(Math.max(--player.health, 0), 10);
            Message.show('That hurt.')
        } else if (cellVal === cells.vibes) {
            player.vibes = Math.min(Math.max(--player.vibes, 0), 10);
            Message.show('You want to go home.')
        }

        updateViewGridAtCoord(viewGrid, [this.y, this.x], cells.player);
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
    cashDisplay.textContent = player.cash > 0 ? player.cash.toFixed(2) : 'broke';
    healthDisplay.textContent = player.health > 0 ? cells.meter.repeat(player.health) + cells.meterEmpty.repeat(10 - player.health) : 'dead';
    vibesDisplay.textContent = player.vibes > 0 ? cells.meter.repeat(player.vibes) + cells.meterEmpty.repeat(10 - player.vibes) : 'sad';
}

// Initialization
let dataGrid = [];
dataGrid = createDataGrid(between(20, 30), between(50, 80));

seedMap();

let viewGrid = [];
viewGrid = createViewGridFromDataGrid(dataGrid);

const playerY = between(1, viewGrid.length - 2);
playerX = between(1, viewGrid[0].length - 2);
const player = new Player(playerY, playerX, 10, 0, 10, dataGrid[playerY][playerX]);
refreshView();
Message.clear();