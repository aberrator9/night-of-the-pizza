const mapArea = document.querySelector('.map-area');
const healthDisplay = document.getElementById('health');
const cashDisplay = document.getElementById('cash');
const vibesDisplay = document.getElementById('vibes');
const message = document.querySelector('.message');

const chars = {
    meter: '⯀', 'meterEmpty': '⬚',
    health: ['+', 'x'], cash: '$', vibes: ['^', 'v'],
    empty: '░', boundary: '█', street: '▒',
    house: 'H',
    player: 'P',
    dogSmall: 'd',
    dogBig: 'D'
};

class Entity {
    constructor(char, y, x, amt, tile) {
        this.y = y;
        this.x = x;
        this.amt = amt;
        this.char = char;
        this.tile = tile;
    }
}

let entities = [];

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
                row.push(chars.empty);
            } else {
                row.push(chars.boundary);
            }
        }
        grid.push(row);
    }
    return grid;
}

function updateDataAtCoord(grid, [y, x], newType) {
    grid[y][x] = newType;
}

function generateMap(vert, horz, houses) {
    // const streetDensity = 0.2;
    // const numStreets = Math.floor(Math.min(dataGrid.length, dataGrid[0].length) * streetDensity);
    const numVertical = vert;
    const numHorizontal = horz;

    // Vertical streets
    let positions = [];
    for (let v = 0; v < numVertical; ++v) {
        let randPos = -1;
        let isValid = false;

        while (randPos === -1 || !isValid) {
            randPos = between(3, tileGrid[0].length - 3);

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
        for (let i = 0; i < tileGrid.length; ++i) {
            updateDataAtCoord(tileGrid, [i, positions[p]], chars.street);
        }
    }

    // Horizontal streets
    positions = [];
    for (let h = 0; h < numHorizontal; ++h) {
        let randPos = -1;
        let isValid = false;

        while (randPos === -1 || !isValid) {
            randPos = between(3, tileGrid.length - 3);

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
        for (let i = 0; i < tileGrid[0].length; ++i) {
            updateDataAtCoord(tileGrid, [positions[p], i], chars.street);
        }
    }

    // Houses

}

function seedEntities() {
    for (let c = 0; c < 25; ++c) {
        const randYX = randomCoords(tileGrid);
        // entities.push(new Entity(chars.cash, randYX.y, randYX.x, between(1, 20), tileGrid[randYX.y][randYX.x]));
        updateViewGridAtCoord(tileGrid, randYX, chars.cash);
    }
    for (let c = 0; c < 5; ++c) {
        const randYX = randomCoords(tileGrid);
        // entities.push(new Entity(chars.health, randYX.y, randYX.x, between(1, 20), tileGrid[randYX.y][randYX.x]));
        updateViewGridAtCoord(tileGrid, randYX, chars.health);
    }
    for (let c = 0; c < 5; ++c) {
        const randYX = randomCoords(tileGrid);
        // entities.push(new Entity(chars.vibes, randYX.y, randYX.x, between(1, 20), tileGrid[randYX.y][randYX.x]));
        updateViewGridAtCoord(tileGrid, randYX, chars.vibes);
    }
    console.log("entities -> " + entities);
}

// View generation
function createViewGridFromDataGrid(dataGrid) {
    const grid = [];
    for (let y = 0; y < dataGrid.length; y++) {
        const row = [];
        for (let x = 0; x < dataGrid[y].length; x++) {
            if (dataGrid[y][x] === chars.vibes) {
                row.push(dataGrid[y][x][1]);
            } else if (dataGrid[y][x] === chars.health) {
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
    constructor(startY, startX, health, cash, vibes) {
        this.x = startX;
        this.y = startY;
        this.health = health;
        this.cash = cash;
        this.vibes = vibes;
        this.tile = tileGrid[startY][startX];

        updateViewGridAtCoord(viewGrid, [startY, startX], chars.player);
    }

    move(y, x) {
        if (this.y + y < 0 || this.y + y >= viewGrid.length ||
            this.x + x < 0 || this.x + x >= viewGrid[0].length) {
            return;
        }

        const tileVal = tileGrid[this.y + y][this.x + x];
        if (tileVal === chars.boundary) {
            return;
        }

        updateViewGridAtCoord(viewGrid, [this.y, this.x], player.tile);

        this.y += y;
        this.x += x;

        this.tile = tileGrid[this.y][this.x];

        if (tileVal === chars.empty) {
            console.log("EMPTY")
        } else if (tileVal === chars.cash) {
            const oldPlayerCash = player.cash;
            const newCash = betweenFloat(1, 20); // Generate a truncated random cash value
            player.cash += newCash;
            player.cash = +(player.cash).toFixed(2);
            Message.show(`Picked up $${(player.cash - oldPlayerCash).toFixed(2)}` + '.');
            updateDataAtCoord(tileGrid, [this.y, this.x], player.tile);
        } else if (tileVal === chars.health) {
            player.health = Math.min(Math.max(--player.health, 0), 10);
            Message.show('That hurt.')
        } else if (tileVal === chars.vibes) {
            player.vibes = Math.min(Math.max(--player.vibes, 0), 10);
            Message.show('You want to go home.')
        }

        updateViewGridAtCoord(viewGrid, [this.y, this.x], chars.player);
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
    healthDisplay.textContent = player.health > 0 ? chars.meter.repeat(player.health) + chars.meterEmpty.repeat(10 - player.health) : 'dead';
    vibesDisplay.textContent = player.vibes > 0 ? chars.meter.repeat(player.vibes) + chars.meterEmpty.repeat(10 - player.vibes) : 'sad';
}

// Initialization
let tileGrid = [];
tileGrid = createDataGrid(between(20, 30), between(50, 80));

generateMap(3, 3, 10);
seedEntities();

let viewGrid = [];
viewGrid = createViewGridFromDataGrid(tileGrid);

const playerY = between(1, viewGrid.length - 2);
playerX = between(1, viewGrid[0].length - 2);
const player = new Player(playerY, playerX, 10, 0, 10, tileGrid[playerY][playerX]);
refreshView();
Message.clear();