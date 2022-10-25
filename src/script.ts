
import { balls, defaultSettings, display, renderDefaultBalls, renderTileset, tileset } from "./gameRenderer.js"
import { Settings, Tileset } from "./types/types"

const app: HTMLDivElement = document.querySelector('#app')
const colors: string[] = ['#FA6B5D', '#F79C53', '#EFC95E', '#76BD6D', '#59AAA4', '#9F82C4', '#C482BD']


renderDefaultBalls(tileset, balls, defaultSettings, colors)
app.append(display(tileset, balls, defaultSettings))

console.table(tileset)  