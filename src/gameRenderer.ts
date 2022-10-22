import { getRandomInt } from "./misc";
import { Settings, Tileset } from "./types/types";

export function renderTileset(width: number, height: number) {
    let tab = []

    for (let x: number = 0; x < height; x++) {
        tab[x] = []
        for (let y: number = 0; y < width; y++) {
            tab[x][y] = 0
        }
    }

    return tab;
}

export function renderDefaultBalls(tileset: Tileset, settings: Settings) {
    for (let i = 0; i < settings.defaultObstacles; i++) {
        let cords: number[] = [getRandomInt(settings.height), getRandomInt(settings.width)]

        while (tileset[cords[0]][cords[1]] == settings.defaultObstacleMark) {
            cords = [getRandomInt(settings.height), getRandomInt(settings.width)]
        }

        tileset[cords[0]][cords[1]] = settings.defaultObstacleMark
    }
}