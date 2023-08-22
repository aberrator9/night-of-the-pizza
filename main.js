const mapArea = document.querySelector('.map-area');
const playerChar = 'P';
const wallChar = '█';
const streetChar = '▒';
const smallDogChar = 'd';
const emptyChar = '░';
const houseChar = 'H';
let house = [];
let numHouses = between(5, 10);

// Helpers
function between(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCoords(height, width) {
    return [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
}

// Grid generation
let grid = [];

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

grid = createGrid(between(10, 25), between(20, 50));


// Player initialization and movement
addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        console.log('Up was pressed');
        player.move(-1, 0);
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        console.log('Right was pressed');
        player.move(0, 1);
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        console.log('Down was pressed');
        player.move(1, 0);
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        console.log('Left was pressed');
        player.move(0, -1);
    }
});

class Player {
    constructor(startY, startX, health) {
        this.x = startX;
        this.y = startY;
        this.health = 100;

        replaceCoordinate(grid, startY, startX, playerChar);
        refreshDisplay();
    }

    move(y, x) {
        if (this.y + y < 0 || this.y + y >= grid.length ||
            this.x + x < 0 || this.x + x >= grid[0].length) {
            return;
        }

        replaceCoordinate(grid, this.y, this.x, emptyChar);

        this.y += y;
        this.x += x;

        replaceCoordinate(grid, this.y, this.x, playerChar);
        refreshDisplay();
    }
}

const player = new Player(between(1, grid.length - 2), between(1, grid[0].length - 2))

// Display
function replaceCoordinate(grid, y, x, newChar) {
    grid[y][x] = newChar;
}

function refreshDisplay() {
    const mapContent = grid.map(row => row.join('')).join('\n');
    mapArea.innerHTML = mapContent;
}