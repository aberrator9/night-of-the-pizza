const mapArea = document.querySelector('.map-area');
const healthDisplay = document.getElementById('health');
const cashDisplay = document.getElementById('cash');
const vibesDisplay = document.getElementById('vibes');
const messages = document.querySelectorAll('.message');

const chars = {
    meter: '⯀', meterEmpty: '⬚',
    health: ['+', 'x'], cash: '$', vibes: ['^', 'v'],
    empty: '\u00A0', // Non-breaking space (unicode)
    boundary: '█', street: '░',
    house: 'H',
    player: 'P',
    dogSmall: 'd',
    dogBig: 'D'
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
    static clear() {
        messages.forEach(msg => { msg.textContent = '' });
    }

    static show(msg) {
        messages[2].textContent = messages[1].textContent;
        messages[1].textContent = messages[0].textContent;
        messages[0].textContent = msg;
    }
}

function getRandomMsg(array) {
    return array[Math.floor(Math.random() * array.length)];
}

let fingerCount = 10;
const vibesDownMsgs = ['Frick.', 'Not good.', 'You want to go home.', "This isn't your day.", 'Yikes.', 'You think about giving up.'];
const vibesUpMsgs = ['Yippee!', 'Nice.', 'Seems good.', 'You feel a little better.'];
const healthUpMsgs = ['Healed.', 'You feel healthier.', 'You are invigorated'];
const healthDownMsgs = ['Ow.', 'Ouch.', 'That hurt.', 'You stubbed your toe.', 'You tripped.', 'Some of your blood fell out.', 'Acquired [New Hole].'];
const randomMsgs = [
    'You remembered your high school math teacher.',
    'Peepers sing in the bushes. They grow quiet as you near.',
    'Distant giggling.',
    'Someone laid on the horn.'
];

// Grid generation
function createTileGrid(rows, cols) {
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

function drawEnvironment(vert, horz, houses) {
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

    for (let p = 0; p < positions.length; ++p) {
        for (let i = 0; i < tileGrid.length; ++i) {
            updateGridAtCoord(tileGrid, [i, positions[p]], chars.street);
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

    for (let p = 0; p < positions.length; ++p) {
        for (let i = 0; i < tileGrid[0].length; ++i) {
            updateGridAtCoord(tileGrid, [positions[p], i], chars.street);
        }
    }

    // Houses

}

// Entities
class Entity {
    constructor(char, y, x, amt, msg) {
        this.y = y;
        this.x = x;
        this.amt = amt;
        this.char = char;
        this.msg = msg
    }
}

let entities = [];

function seedEntities() {
    for (let c = 0; c < 2; ++c) {
        const randYX = randomCoords(tileGrid);
        console.log(randYX);
        entities.push(new Entity(chars.cash, randYX[0], randYX[1], betweenFloat(1, 20)));
        // updateGridAtCoord(tileGrid, randYX, chars.cash);
    }
    for (let c = 0; c < 5; ++c) {
        const randYX = randomCoords(tileGrid);
        entities.push(new Entity(chars.health[1], randYX[0], randYX[1], -1, getRandomMsg(healthDownMsgs)));
        // updateGridAtCoord(tileGrid, randYX, chars.health);
    }
    for (let c = 0; c < 5; ++c) {
        const randYX = randomCoords(tileGrid);
        entities.push(new Entity(chars.vibes[1], randYX[0], randYX[1], -1, getRandomMsg(vibesDownMsgs)));
        // updateGridAtCoord(tileGrid, randYX, chars.vibes);
    }
    console.log("entities -> " + entities);
}

// View generation
function createViewGrid(tileGrid) {
    const grid = [];
    for (let y = 0; y < tileGrid.length; y++) {
        const row = [];
        for (let x = 0; x < tileGrid[y].length; x++) {
            if (tileGrid[y][x] === chars.vibes) {
                row.push(tileGrid[y][x][1]);
            } else if (tileGrid[y][x] === chars.health) {
                row.push(tileGrid[y][x][1]);
            } else {
                row.push(tileGrid[y][x]);
            }
        }
        grid.push(row);
    }
    return grid;
}

function drawEntities() {
    entities.forEach(element => {
        updateGridAtCoord(viewGrid, [element.y, element.x], element.char);
    });
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

        updateGridAtCoord(viewGrid, [startY, startX], chars.player);
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

        updateGridAtCoord(viewGrid, [this.y, this.x], player.tile);

        this.y += y;
        this.x += x;

        this.tile = tileGrid[this.y][this.x];

        // Check list of entities for any in this space
        for (let i = 0; i < entities.length; ++i) {
            if (!entities[i] || entities[i].y != this.y || entities[i].x != this.x) {
                continue;
            }

            if (entities[i].char === chars.cash) {
                const oldPlayerCash = player.cash;
                player.cash += entities[i].amt;
                player.cash = +(player.cash).toFixed(2);
                Message.show(`Picked up $${(player.cash - oldPlayerCash).toFixed(2)}` + '.');
            } else if (entities[i].char === chars.health[1]) {
                player.health += entities[i].amt;
                player.health = Math.min(Math.max(player.health, 0), 10);
            } else if (entities[i].char === chars.vibes[1]) {
                player.vibes += entities[i].amt;
                player.vibes = Math.min(Math.max(player.vibes, 0), 10);
            }

            if (entities[i].char != chars.cash) {
                // Chance to show finger message
                if (entities[i].char = chars.health[1] && between(0, 5) > 3) {
                    Message.show(`Finger count: ${--fingerCount}`);
                }
                else {
                    Message.show(entities[i].msg);
                }
            }
            entities.splice(i, 1, undefined);
        }

        updateGridAtCoord(viewGrid, [this.y, this.x], chars.player);
        refreshViewAndHud();
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

// Grid helpers
function updateGridAtCoord(grid, [y, x], newData) {
    grid[y][x] = newData;
}

function refreshViewAndHud() {
    const mapContent = viewGrid.map(row => row.join('')).join('\n');
    mapArea.textContent = mapContent;
    cashDisplay.textContent = player.cash > 0 ? player.cash.toFixed(2) : 'broke';
    healthDisplay.textContent = player.health > 0 ? chars.meter.repeat(player.health) + chars.meterEmpty.repeat(10 - player.health) : 'dead';
    vibesDisplay.textContent = player.vibes > 0 ? chars.meter.repeat(player.vibes) + chars.meterEmpty.repeat(10 - player.vibes) : 'sad';
}

// Initialization
let tileGrid = [];
tileGrid = createTileGrid(between(20, 30), between(50, 80));

drawEnvironment(3, 3, 10);
seedEntities();

let viewGrid = [];
viewGrid = createViewGrid(tileGrid);

drawEntities();

const playerY = between(1, viewGrid.length - 2);
playerX = between(1, viewGrid[0].length - 2);
const player = new Player(playerY, playerX, 10, 0, 10, tileGrid[playerY][playerX]);
refreshViewAndHud();
Message.clear();