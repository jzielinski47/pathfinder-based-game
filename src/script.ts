
import { display, renderDefaultBalls, renderTileset } from "./gameRenderer.js"
import { Settings, Tileset } from "./types/types"

const app: HTMLDivElement = document.querySelector('#app')
const colors: string[] = ['#FA6B5D', '#F79C53', '#EFC95E', '#76BD6D', '#59AAA4', '#9F82C4', '#C482BD']

export const defaultSettings: Settings = {
    width: 9,
    height: 9,
    defaultObstacles: 6,
    defaultSeeker: 'S',
    defaulWaypoint: 'W',
    defaultObstacleMark: '#',
}

export const tileset: Tileset = renderTileset(defaultSettings.width, defaultSettings.height)
export const balls: Tileset = renderTileset(defaultSettings.width, defaultSettings.height)
renderDefaultBalls(tileset, balls, defaultSettings, colors)
app.append(display(tileset, balls, defaultSettings))

console.table(tileset)  