import { colors } from "./main.js";
import { checkAll4Neighbours, clearNums, getCords, getRandomInt, removeClassName, removeFromArray, returnEventListeners } from "./misc.js";
import { renderSphere } from "./objectRenderer.js";
import { Sphere } from "./Sphere.js";
let localSphereMemory = [];
renderUpcoming(3, colors);
let seeker;
let seekerColor;
let waypoint;
let progressStatus = 0;
let inMotion = false;
let movePossible;
export function sphereClickHandler(e, x, y, tileset, settings) {
    const target = e.currentTarget;
    clearNums(tileset, settings);
    if (progressStatus < 2) {
        if (!target.classList.contains('seeker')) {
            if (checkAll4Neighbours(x, y, tileset, settings)) {
                removeFromArray(settings.defaultSeeker, tileset, false, settings);
                removeClassName('seeker');
                seeker = [x, y];
                target.classList.add('seeker');
                tileset[x][y] = settings.defaultSeeker;
                seekerColor = target.style.background;
                // runSearchEngine
                runSearchEngine(seeker, 0, tileset, settings);
                progressStatus = 1;
            }
        }
        else {
            removeFromArray(settings.defaultSeeker, tileset, false, settings);
            removeClassName('seeker');
            seeker = [];
            progressStatus = 0;
        }
    }
    console.table(tileset);
}
export function runSearchEngine(seeker, round, tileset, settings) {
    function inspectSingleTile(offsetX, offsetY) {
        var _a;
        let expression = (_a = tileset[seeker[0] + offsetX]) === null || _a === void 0 ? void 0 : _a[seeker[1] + offsetY];
        if (expression === 0) {
            expression = expression + round;
            tileset[seeker[0] + offsetX][seeker[1] + offsetY] = expression;
            // display number
            // let destination = document.getElementById(`${seeker[0] + offsetX}-${seeker[1] + offsetY}`)
            // destination.innerHTML = expression.toString()
            setTimeout(() => runSearchEngine([seeker[0] + offsetX, seeker[1] + offsetY], round, tileset, settings), 1);
        }
    }
    round++;
    inspectSingleTile(-1, 0);
    inspectSingleTile(1, 0);
    inspectSingleTile(0, -1);
    inspectSingleTile(0, 1);
}
export function tileHoverHandler(e, tileset, settings) {
    const target = e.currentTarget;
    if (progressStatus == 1) {
        waypoint = getCords(target.id);
        if (seeker != waypoint)
            target.classList.add('waypoint');
        findBestRoute(waypoint, tileset[waypoint[0]][waypoint[1]], tileset, settings);
    }
}
export function tileResetHandler() {
    if (!inMotion) {
        removeClassName('path');
        removeClassName('waypoint');
    }
}
export function tileClickHandler(e, tileset, settings) {
    const target = e.currentTarget;
    if (progressStatus == 1) {
        waypoint = getCords(target.id);
        if (seeker != waypoint)
            target.classList.add('waypoint');
        if (movePossible) {
            moveSphere(seeker, waypoint, tileset, settings);
            progressStatus = 2;
        }
    }
}
function findBestRoute(waypoint, majorDist, tileset, settings) {
    let route = [majorDist];
    function findAvailableTile(wX, wY, offsetX, offsetY, dist) {
        var _a;
        let expression = (_a = tileset[wX + offsetX]) === null || _a === void 0 ? void 0 : _a[wY + offsetY];
        if (!route.includes(expression)) {
            if (expression === dist - 1) {
                route.push(expression);
                document.getElementById(`${wX + offsetX}-${wY + offsetY}`).classList.add('path');
                // console.log(route)
                findAvailableTile(wX + offsetX, wY + offsetY, -1, 0, dist - 1);
                findAvailableTile(wX + offsetX, wY + offsetY, 1, 0, dist - 1);
                findAvailableTile(wX + offsetX, wY + offsetY, 0, -1, dist - 1);
                findAvailableTile(wX + offsetX, wY + offsetY, 0, 1, dist - 1);
            }
        }
    }
    findAvailableTile(waypoint[0], waypoint[1], -1, 0, majorDist);
    findAvailableTile(waypoint[0], waypoint[1], 1, 0, majorDist);
    findAvailableTile(waypoint[0], waypoint[1], 0, -1, majorDist);
    findAvailableTile(waypoint[0], waypoint[1], 0, 1, majorDist);
    movePossible = (majorDist === route.length);
}
export function moveSphere(seeker, waypoint, tileset, settings) {
    const origin = document.getElementById(`${seeker[0]}-${seeker[1]}`);
    let destination = document.getElementById(`${waypoint[0]}-${waypoint[1]}`);
    destination.replaceWith(destination.cloneNode(false));
    destination = document.getElementById(`${waypoint[0]}-${waypoint[1]}`);
    removeFromArray(settings.defaultSeeker, tileset, true, settings);
    tileset[waypoint[0]][waypoint[1]] = settings.defaultSphere;
    inMotion = true;
    origin.innerHTML = '';
    destination.innerHTML = '';
    removeClassName('waypoint');
    destination.append(renderSphere(waypoint[0], waypoint[1], seekerColor, tileset, settings));
    console.table(tileset);
    setTimeout(() => {
        resetPathfinder(tileset, settings);
        renderUpcoming(3, colors);
    }, 1000);
}
export function resetPathfinder(tileset, settings) {
    inMotion = false;
    progressStatus = 0;
    removeClassName('seeker');
    removeClassName('path');
    removeFromArray(settings.defaultSeeker, tileset, true, settings);
    removeFromArray(settings.defaultWaypoint, tileset, true, settings);
    document.querySelector('#upcoming').innerHTML = '';
    appendToTileset(tileset, settings);
    localSphereMemory = [];
    clearNums(tileset, settings);
    returnEventListeners(tileset, settings);
}
export function renderUpcoming(amount, colors) {
    const upcomingSpheres = document.querySelector('#upcoming');
    for (let i = 0; i < amount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const model = new Sphere(color);
        const sphere = model.render();
        sphere.classList.add('default');
        localSphereMemory.push(color);
        upcomingSpheres.append(sphere);
    }
    console.log(localSphereMemory);
}
export function appendToTileset(tileset, settings) {
    for (let i = 0; i < localSphereMemory.length; i++) {
        let cords = [getRandomInt(settings.height), getRandomInt(settings.width)];
        // console.warn('d')
        while (tileset[cords[0]][cords[1]] == settings.defaultSphere) {
            cords = [getRandomInt(settings.height), getRandomInt(settings.width)];
        }
        tileset[cords[0]][cords[1]] = settings.defaultSphere;
        const destination = document.getElementById(cords[0] + '-' + cords[1]);
        destination.replaceWith(destination.cloneNode(false));
        destination.innerHTML = '';
        document.getElementById(cords[0] + '-' + cords[1]).append(renderSphere(cords[0], cords[1], localSphereMemory[i], tileset, settings));
        // console.table(tileset)
    }
}
