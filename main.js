const gameScreen = document.querySelector('.game-screen');
const player = 'P';
const wall = '';
const smallDog = 'd';
const empty = '.';

let map = [];
let mapX = Math.floor(Math.random() * 40 + 20);
let mapY = Math.floor(Math.random() * 40 + 20);

gameScreen.innerHTML = generateMap();

function generateMap() {
    map = [];
    for (let y = 0; y < mapY; ++y) {
        let row = '';

        if (y > 0 && y < mapY - 1) {
            for (let x = 0; x < mapX; ++x) {
                if (x > 0 && x < mapX - 1) {
                    row += empty;
                } else {
                    row += wall;
                }
            }
        } else {
            row = wall.repeat(mapX);
        }
        map.push(row);
    }

    return map.join('\n');
}