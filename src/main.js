import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
// import '@fortawesome/fontawesome-free/js/regular'
// import '@fortawesome/fontawesome-free/js/brands'
import SimplexNoise from 'simplex-noise'
import TWEEN from '@tweenjs/tween.js'
const c = document.getElementById('myCanvas')
const homeButton = document.getElementById('home')
const shopButton = document.getElementById('shop')
const stonePitButton = document.getElementById('stonePit')
const observationTowerButton = document.getElementById('observationTower')
const sawmillButton = document.getElementById("sawmill")
const ctx = c.getContext('2d')

window.CanvasRenderingContext2D.prototype.roundRect = (x, y, width, height, radius) => {
  if (width < 2 * radius) radius = width / 2
  if (height < 2 * radius) radius = height / 2
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
  return ctx
}

const drawHexagon = (x, y, s, biome, type = 'normal') => {
  if (biome === 0) {
    return
  } else if (biome === 1) {
    ctx.fillStyle = '#19bf1e' // plains
  } else if (biome === 2) {
    ctx.fillStyle = '#2e8200' // mountains
  } else if (biome === 4) {
    ctx.fillStyle = '#d8eb02' // beach
  } else {
    ctx.fillStyle = biome
  }
  if (type === 'normal') {
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 1
  } else if (type === 'cursor') {
    ctx.lineWidth = 5
    ctx.strokeStyle = biome
  }
  ctx.beginPath()
  ctx.moveTo(x, y - s / 2)
  ctx.lineTo(x + s / 2, y - s / 4)
  ctx.lineTo(x + s / 2, y)
  ctx.lineTo(x, y + s / 4)
  ctx.lineTo(x - s / 2, y)
  ctx.lineTo(x - s / 2, y - s / 4)
  ctx.lineTo(x, y - s / 2)
  ctx.closePath()
  if (type === 'normal') {
    ctx.stroke()
    ctx.fill()
  } else if (type === 'cursor' || type === 'placingCursor') {
    ctx.stroke()
  }
}
const drawObject = (x, y, s, type) => {
  if (type === 1) { // forest
    ctx.fillStyle = '#4f2602'
    ctx.strokeStyle = 'black'
    ctx.fillRect(x - s / 6, y - s / 6, s/3, s/3)
    ctx.strokeRect(x - s / 6, y - s / 6, s/3, s/3)

    ctx.fillStyle = '#248016'
    ctx.beginPath()
    ctx.arc(x, y - s * 3 / 12, s/3, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  } else if (type === 2) { // main base
    s /= 2
    ctx.fillStyle = 'gray'
    ctx.strokeStyle = 'black'
    ctx.fillRect(x - s, y - s, s * 2, s)
    ctx.strokeRect(x - s, y - s, s * 2, s)
  }
}

const drawBuilding = (x, y, s, type) => {
  if (type === 1) { // stone pit
    const m = s / 8
    ctx.fillStyle = 'gray'
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'

    ctx.beginPath()
    ctx.moveTo(x - m * 3.5, y)
    ctx.lineTo(x - m * 3, y - m)
    ctx.lineTo(x - m * 2.5, y - m)
    ctx.lineTo(x - m * 2.5, y - m * 2)
    ctx.lineTo(x - m * 2, y - m * 2.5)
    ctx.lineTo(x - m * 1.5, y - m * 3.5)
    ctx.lineTo(x - m, y - m * 3)
    ctx.lineTo(x - m * 0.5, y - m * 3)
    ctx.lineTo(x, y - m * 3.5)
    ctx.lineTo(x + m, y - m * 3.5)
    ctx.lineTo(x + m * 1.5, y - m * 4)
    ctx.lineTo(x + m * 2, y - m * 3)
    ctx.lineTo(x + m * 2.5, y - m * 3)
    ctx.lineTo(x + m * 2.5, y - m * 2)
    ctx.lineTo(x + m * 3, y - m)
    ctx.lineTo(x + m * 3.5, y - m * 1.5)
    ctx.lineTo(x + m * 4, y)
    ctx.lineTo(x - m * 3.5, y)

    ctx.moveTo(x - m * 4.5, y)
    ctx.lineTo(x - m * 4, y - m * 0.5)
    ctx.lineTo(x - m * 4, y)
    ctx.lineTo(x - m * 4.5, y)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#573c05'

    ctx.beginPath()
    ctx.moveTo(x - m * 1.5, y)
    ctx.lineTo(x - m, y)
    ctx.lineTo(x - m * 0.5, y - m * 2)
    ctx.lineTo(x - m, y - m * 2)
    ctx.lineTo(x - m * 1.5, y)

    ctx.moveTo(x + m * 1.5, y)
    ctx.lineTo(x + m, y)
    ctx.lineTo(x + m * 0.5, y - m * 2)
    ctx.lineTo(x + m, y - m * 2)
    ctx.lineTo(x + m * 1.5, y)

    ctx.moveTo(x - m * 1.5, y - m * 2.5)
    ctx.lineTo(x + m * 1.5, y - m * 2.5)
    ctx.lineTo(x + m * 1.25, y - m * 2)
    ctx.lineTo(x - m * 1.25, y - m * 2)
    ctx.lineTo(x - m * 1.5, y - m * 2.5)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = 'black'

    ctx.beginPath()
    ctx.moveTo(x - m, y)
    ctx.lineTo(x - m * 0.5, y - m * 2)
    ctx.lineTo(x + m * 0.5, y - m * 2)
    ctx.lineTo(x + m, y)
    ctx.closePath()

    ctx.fill()
  } else if (type === 2) { // observation tower
    const m = s / 6
    ctx.fillStyle = '#402800'
    ctx.lineWidth = 1
    ctx.strokeStyle = 'black'

    ctx.beginPath()
    ctx.moveTo(x - m * 1.5, y)
    ctx.lineTo(x - m, y)
    ctx.lineTo(x - m * 0.5, y - m * 2)
    ctx.lineTo(x - m, y - m * 2)
    ctx.lineTo(x - m * 1.5, y)
    ctx.moveTo(x + m * 1.5, y)
    ctx.lineTo(x + m, y)
    ctx.lineTo(x + m * 0.5, y - m * 2)
    ctx.lineTo(x + m, y - m * 2)
    ctx.lineTo(x + m * 1.5, y)

    ctx.moveTo(x - m * 1.75, y - m * 4)
    ctx.lineTo(x - m * 1.5, y - m * 4.5)
    ctx.lineTo(x + m * 1.5, y - m * 4.5)
    ctx.lineTo(x + m * 1.75, y - m * 4)

    ctx.moveTo(x + m, y - m * 3)
    ctx.lineTo(x + m, y - m * 4)
    ctx.lineTo(x + m * 1.25, y - m * 4)
    ctx.lineTo(x + m * 1.25, y - m * 3)
    ctx.moveTo(x - m, y - m * 3)
    ctx.lineTo(x - m, y - m * 4)
    ctx.lineTo(x - m * 1.25, y - m * 4)
    ctx.lineTo(x - m * 1.25, y - m * 3)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.strokeStyle = '#3d3d3d'
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.moveTo(x - m, y)
    ctx.lineTo(x + m * 0.5, y - m * 2)
    ctx.moveTo(x + m, y)
    ctx.lineTo(x - m * 0.5, y - m * 2)
    ctx.closePath()

    ctx.stroke()

    ctx.fillStyle = '#3d3d3d'
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(x - m * 1.25, y - m * 2)
    ctx.lineTo(x + m * 1.25, y - m * 2)
    ctx.lineTo(x + m * 1.5, y - m * 3)
    ctx.lineTo(x - m * 1.5, y - m * 3)
    ctx.lineTo(x - m * 1.25, y - m * 2)
    ctx.moveTo(x - m * 1.75, y - m * 4)
    ctx.lineTo(x + m * 1.75, y - m * 4)
    ctx.lineTo(x + m * 1.5, y - m * 3.75)
    ctx.lineTo(x - m * 1.5, y - m * 3.75)
    ctx.lineTo(x - m * 1.75, y - m * 4)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()
  }else if(type === 3){
    const m = s/15
    const trunkOffset = { x: 0, y:0}
    ctx.strokeStyle = "black"
    ctx.fillStyle = "#66471d"
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(trunkOffset.x + x-m*3, y)
    ctx.lineTo(trunkOffset.x + x-m, y-m*2)
    ctx.lineTo(trunkOffset.x + x-m, y-m*4)
    ctx.lineTo(trunkOffset.x + x+m, y-m*4)
    ctx.lineTo(trunkOffset.x + x+m*3, y-m*2)
    ctx.lineTo(trunkOffset.x + x+m*3, y)
    ctx.lineTo(trunkOffset.x + x-m*3, y)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "#c4a458"
    
    ctx.beginPath()
    ctx.moveTo(x-m*6,y-m)
    ctx.arc(x-m*5, y-m, m, 0, Math.PI)
    ctx.moveTo(x+m*4,y-m)
    ctx.arc(x+m*5, y-m, m, 0, Math.PI)
    ctx.closePath()
    
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "#6e4f10"

    ctx.beginPath()
    ctx.moveTo(x-m*4, y-m)
    ctx.lineTo(x-m*3, y-m)
    ctx.arc(x-m*4, y-m, m, 0, 0.5 * Math.PI)
    ctx.lineTo(x-m*5, y)
    ctx.arc(x-m*5, y-m, m, 0.5*Math.PI, 0, true)

    ctx.moveTo(x+m*6, y-m)
    ctx.lineTo(x+m*7, y-m)
    ctx.arc(x+m*6, y-m, m, 0, 0.5 * Math.PI)
    ctx.lineTo(x+m*5, y)
    ctx.arc(x+m*5, y-m, m, 0.5*Math.PI, 0, true)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "#6e6e6e"

    ctx.beginPath()
    ctx.moveTo(x, y-m*4)
    ctx.lineTo(x+m, y-m*5)
    ctx.lineTo(x+m, y-m*5.5)
    ctx.lineTo(x, y-m*6)
    ctx.lineTo(x-m, y-m*5)
    ctx.lineTo(x-m*0.5, y-m*4)

    ctx.moveTo(x-m*0.5, y-m*6.5)
    ctx.lineTo(x-m*1.5, y-m*6.5)
    ctx.lineTo(x-m*1.5, y-m*5.5)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = "#6e4f10"

    ctx.beginPath()
    ctx.moveTo(x-m*1.5, y-m*4.5)
    ctx.lineTo(x-m*1.75, y-m*5.25)
    ctx.lineTo(x+m*2.5, y-m*9.5)
    ctx.lineTo(x+m*3, y-m*9)
    ctx.lineTo(x-m*1.5, y-m*4.5)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()
  }
}

const checkPointInHexagon = (x, y, s, cX, cY) => {
  if (pointWhichSide(x, y - s / 2, x + s / 2, y - s / 4, cX, cY) !== -1) { return false }
  if (pointWhichSide(x + s / 2, y - s / 4, x + s / 2, y, cX, cY) !== -1) { return false }
  if (pointWhichSide(x + s / 2, y, x, y + s / 4, cX, cY) !== -1) { return false }
  if (pointWhichSide(x, y + s / 4, x - s / 2, y, cX, cY) !== 1) { return false }
  if (pointWhichSide(x - s / 2, y, x - s / 2, y - s / 4, cX, cY) !== 1) { return false }
  if (pointWhichSide(x - s / 2, y - s / 4, x, y - s / 2, cX, cY) !== 1) { return false }
  return true
}

const hexcoords = (x, y) => {
  return { x: (y - x), y: (y + x) }
}
const strcoords = (x, y) => {
  return (x.toString() + ':' + y.toString())
}

const pointWhichSide = (x1, y1, x2, y2, x3, y3) => {
  if (y1 - y2 !== 0) {
    const x4 = (y3 - y1) * (x1 - x2) / (y1 - y2) + x1
    if (x4 <= x3) {
      return 1
    } else {
      return -1
    }
  } else {
    if (y3 >= y1) {
      return 1
    } else {
      return -1
    }
  }
}

// terrain generation

const simplex = new SimplexNoise()
let krat = 20

// biomes
const T = {}

// objects
const O = {}

// buildings
const B = {}

// explored terrain
const E = {}

const basePosition = { x: 0, y: 0 }

const getSimplex = (x, y) => {
  return (simplex.noise2D(x / 12, y / 12))
}

const generateCell = (x, y) => {
  T[strcoords(x, y)] = generationLogics(getSimplex(x, y)).T
  if (x === basePosition.x && y === basePosition.y) {
    return 2
  } else {
    O[strcoords(x, y)] = generationLogics(getSimplex(x, y)).O
  }
}

const generationLogics = (x) => {
  const R = {}
  if (x > 0) {
    if (x * 2 + 1 >= 1 && x * 2 + 1 < 2) {
      R.T = 1 // plains
    } else if (x * 2 + 1 >= 2 && x * 2 + 1 <= 3) {
      R.T = 2 // mountains
    } else {
      R.T = 0
    }
    if (x * 2 + 1 > 1 && x * 2 + 1 < 1.25) {
      R.T = 4 // beach
    }

    if (x * 2 + 1 >= 1.25 && x * 2 + 1 < 2 && Math.floor((x * 2 + 1) * 10000) % 3 === 0) {
      R.O = 1 // forest
    } else {
      R.O = 0
    }
  } else {
    R.T = 0 // biome
    R.O = 0 // object
  }
  return R
}

const generateStartingTerrain = () => {
  for (let i = basePosition.x - Math.floor(krat / 2); i < basePosition.x + Math.floor(krat / 2); i++) {
    for (let j = basePosition.y - Math.floor(krat / 2); j < basePosition.y + Math.floor(krat / 2); j++) {
      T[strcoords(i, j)] = generationLogics(getSimplex(i, j)).T
      O[strcoords(i, j)] = generationLogics(getSimplex(i, j)).O

      // x*2+1  ->  1 - 3
    }
  }
}

generateStartingTerrain()

const nearObjects = (x, y, object, radius) => {
  let count = 0
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && y + radius) && !(i === x && j === y)) {
        if (O[strcoords(i, j)] === undefined) {
          generateCell(i, j)
        }
        if (O[strcoords(i, j)] === object) {
          count++
        }
      }
    }
  }
  return count
}
const nearBiomes = (x, y, biome, radius) => {
  let count = 0
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && y + radius) && !(i === x && j === y)) {
        if (T[strcoords(i, j)] === undefined) {
          generateCell(i, j)
        }
        if (T[strcoords(i, j)] === biome) {
          count++
        }
      }
    }
  }
  return count
}

const explore = (x, y, radius, ex = { T: 'every', O: 'every' }) => {
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && j === y + radius) && !(i === x + radius && j === y + radius)) {
        if (ex.T === 'every' && ex.O === 'every') {
          E[strcoords(i, j)] = 1
        }
      }
    }
  }
}

while (true) {
  const X = basePosition.x
  const f = getSimplex(X, 0)
  if (f * 2 + 1 >= 1.25 && f * 2 + 1 < 2 && Math.floor((f * 2 + 1) * 10000) % 3 !== 0) {
    if (nearObjects(X, 0, 1, 1) > 0 && nearBiomes(X, 0, 1, 1) > 2 && nearBiomes(X, 0, 0, 2) > 0 && nearBiomes(X, 0, 2, 2) > 0) {
      O[strcoords(basePosition.x, 0)] = 2 // main base
      break
    }
  }
  basePosition.x++
}

explore(basePosition.x, basePosition.y, 2)

const focus = { x: basePosition.x, y: basePosition.y - 1 }
let cursor = { x: 'nope', y: 'nope' }
const scrollingOffset = { x: 0, y: 0 }

let _W = window.innerWidth
let _H = window.innerHeight
let Clicked = false
let clickX, clickY
let toggleShop = 0
let offsetW, offsetH
let placing = 0
let mouseX, mouseY

let a = _H / krat * 2

let wood = 300
const woodLimit = 500
let stone = 300
const stoneLimit = 500

let stoneIncreasing = 0
let woodIncreasing = 0
const stonePitPrice = { wood: 20, stone: 40 }
const observationTowerPrice = { wood: 100, stone: 80 }
const sawmillPrice = { wood: 20, stone: 20 }

let time = Date.now()
// const lastTime = Date.now()

const loop = (tick) => {
  window.requestAnimationFrame(loop)
  time = Date.now()

  if (time % 100 <= 20) {
    stone = Math.min(stoneLimit, stone + stoneIncreasing)
    wood = Math.min(woodLimit, wood + woodIncreasing)
  }

  _W = window.innerWidth
  _H = window.innerHeight
  a = _H / krat * 2

  offsetH = _H / 2 - a * hexcoords(focus.x + scrollingOffset.x, focus.y + scrollingOffset.y).y - a * 3 / 4
  offsetW = _W / 2 - a * hexcoords(focus.x + scrollingOffset.x, focus.y + scrollingOffset.y).x - a

  c.width = _W
  c.height = _H

  if (toggleShop === 1) {
    // shop gui
    // clear screen
    ctx.fillStyle = '#699129'
    ctx.fillRect(0, 0, _W, _H)

    ctx.roundRect(20, 20, _W - 40, _H - 40, 20)
    ctx.fillStyle = '#78a62e'
    ctx.fill()

    // wood storage
    ctx.roundRect(_W - 230, 30, wood / woodLimit * 200, 30, 10)
    ctx.fillStyle = '#9c772d'
    ctx.fill()
    ctx.roundRect(_W - 230, 30, 200, 30, 10)
    ctx.lineWidth = 2
    ctx.stroke()
    drawObject(_W - 215, 50, 25, 1)
    // stone storage
    ctx.roundRect(_W - 440, 30, stone / stoneLimit * 200, 30, 10)
    ctx.fillStyle = '#525252'
    ctx.fill()
    ctx.roundRect(_W - 440, 30, 200, 30, 10)
    ctx.lineWidth = 2
    ctx.stroke()

    document.getElementById('home').style.display = 'none'
    stonePitButton.style.display = 'block'
    observationTowerButton.style.display = 'block'
    sawmillButton.style.display = 'block'

    const shopButtonWidth = parseInt(window.getComputedStyle(stonePitButton).width)
    const shopButtonHeight = parseInt(window.getComputedStyle(stonePitButton).height)
    const shopButtonY = parseInt(window.getComputedStyle(stonePitButton).top)
    const stonePitX = parseInt(window.getComputedStyle(stonePitButton).left)
    const sawmillX = parseInt(window.getComputedStyle(sawmillButton).left)
    const observationTowerX = parseInt(window.getComputedStyle(observationTowerButton).left)
    drawBuilding(stonePitX + shopButtonWidth/2, shopButtonY + shopButtonHeight*2 + 10, shopButtonHeight*4/3, 1)
    drawBuilding(sawmillX + shopButtonWidth/2, shopButtonY + shopButtonHeight*2 + 10, shopButtonHeight*4/3, 3)
    drawBuilding(observationTowerX + shopButtonWidth/2, shopButtonY + shopButtonHeight*2 + 10, shopButtonHeight*4/3, 2)

  } else if (toggleShop === 0) {
    document.getElementById('home').style.display = 'block'
    stonePitButton.style.display = 'none'
    observationTowerButton.style.display = 'none'
    sawmillButton.style.display = 'none'
    // clear screen
    ctx.fillStyle = '#0000FF'
    ctx.fillRect(0, 0, _W, _H)
    // render Tarrain
    for (let i = Math.floor(focus.x + scrollingOffset.x) - Math.floor(Math.max(_W, _H) / Math.min(_W, _H) * krat / 3); i <= Math.floor(focus.x + scrollingOffset.x) + Math.floor(Math.max(_W, _H) / Math.min(_W, _H) * krat / 3) + 1; i++) {
      for (let j = Math.floor(focus.y + scrollingOffset.y) - Math.floor(Math.max(_W, _H) / Math.min(_W, _H) * krat / 3); j <= Math.floor(focus.y + scrollingOffset.y) + Math.floor(Math.max(_W, _H) / Math.min(_W, _H) * krat / 3) + 1; j++) {
        if (Clicked && checkPointInHexagon(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, clickX, clickY)) {
          if (cursor.x === i && cursor.y === j) {
            cursor = { x: 'nope', y: 'nope' }
          } else {
            cursor.x = i
            cursor.y = j
          }
          Clicked = false
        }

        if (offsetW + a * hexcoords(i, j).x + a > 0 && offsetH + a * hexcoords(i, j).y + a > 0 && offsetW + a * hexcoords(i, j).x - a < _W && offsetH + a * hexcoords(i, j).y - a < _H) {
          if (T[strcoords(i, j)] === undefined || O[strcoords(i, j)] === undefined) {
            generateCell(i, j)
          }
          if (E[strcoords(i, j)] === 1) {
            drawHexagon(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, T[strcoords(i, j)])
            drawObject(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a, O[strcoords(i, j)])
            drawBuilding(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a, B[strcoords(i, j)])
          } else {
            if (T[strcoords(i, j)] <= 0) {
              drawHexagon(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, '#e0e0e0')
            } else {
              drawHexagon(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, '#cccccc')
            }
          }
        }
        //placing cursor while moving
        if (placing !== 0) {
          if (checkPointInHexagon(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, mouseX, mouseY)) {
            cursor.x = i
            cursor.y = j
          }
        }
      }
    }
    if (offsetW + a * hexcoords(cursor.x, cursor.y).x + a < 0 || offsetW + a * hexcoords(cursor.x, cursor.y).x - a > _W || offsetH + a * hexcoords(cursor.x, cursor.y).y + a / 2 < 0 || offsetH + a * hexcoords(cursor.x, cursor.y).y - a > _H) {
      cursor = { x: 'nope', y: 'nope' }
    }

    if (placing === 0) {
      if (cursor.x !== 'nope' && cursor.y !== 'nope') {
        // draw cursor
        drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'black', 'cursor')

        // cell info
        ctx.roundRect(_W * 0.99 - 200, _H * 0.03 + 60, 200, _H * 0.3, 10)
        ctx.fillStyle = '#a6935a'
        ctx.fill()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.lineWidth = 1
        drawObject(_W * 0.99 - 100, _H * 0.06 + 60, _H * 0.04, O[strcoords(cursor.x, cursor.y)])
      }
    } else {
      // draw cursor (green/red)
      if (Math.floor(time) % 800 < 700) {
        if(placing === 1){
          if (E[strcoords(cursor.x, cursor.y)] && (T[strcoords(cursor.x, cursor.y)] === 1 || T[strcoords(cursor.x, cursor.y)] === 2) && O[strcoords(cursor.x, cursor.y)] === 0) {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }else if(placing === 2){
          if (E[strcoords(cursor.x, cursor.y)] && T[strcoords(cursor.x, cursor.y)] === 2 && O[strcoords(cursor.x, cursor.y)] === 0) {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }else if(placing === 3){
          if (E[strcoords(cursor.x, cursor.y)] && O[strcoords(cursor.x, cursor.y)] === 1) {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }
      }
    }
    // wood storage
    ctx.strokeStyle = 'black'
    ctx.roundRect(_W * 0.99 - 200, _H * 0.01, wood / woodLimit * 200, 30, 10)
    ctx.fillStyle = '#9c772d'
    ctx.fill()
    ctx.roundRect(_W * 0.99 - 200, _H * 0.01, 200, 30, 10)
    ctx.lineWidth = 2
    ctx.stroke()
    drawObject(_W * 0.99 - 185, _H * 0.01 + 20, 25, 1)
    // stone storage
    ctx.roundRect(_W * 0.99 - 200, _H * 0.02 + 30, stone / stoneLimit * 200, 30, 10)
    ctx.fillStyle = '#525252'
    ctx.fill()
    ctx.roundRect(_W * 0.99 - 200, _H * 0.02 + 30, 200, 30, 10)
    ctx.lineWidth = 2
    ctx.stroke()

    TWEEN.update(tick)
  }
}

let isDragging = false
let deltaX = 0
let deltaY = 0
let lastX = 0
let lastY = 0
document.addEventListener('mouseup', e => {
  if (e.button === 2) {
    isDragging = false
  }
  Clicked = false
})

c.addEventListener('mousedown', e => {
  if (e.button === 2) {
    lastX = e.clientX
    lastY = e.clientY
    isDragging = true
  } else if (placing !== 0) {
    if (placing === 1) {
      if (E[strcoords(cursor.x, cursor.y)] && (T[strcoords(cursor.x, cursor.y)] === 1 || T[strcoords(cursor.x, cursor.y)] === 2) && O[strcoords(cursor.x, cursor.y)] === 0) {      
        if (stone >= stonePitPrice.stone && wood >= stonePitPrice.wood) {
          stoneIncreasing += 0.1
          stone -= stonePitPrice.stone
          wood -= stonePitPrice.wood
          explore(cursor.x, cursor.y, 1)
          B[strcoords(cursor.x, cursor.y)] = placing
        }
      } 
    }else if (placing === 2) {
      if (E[strcoords(cursor.x, cursor.y)] && T[strcoords(cursor.x, cursor.y)] === 2 && O[strcoords(cursor.x, cursor.y)] === 0) {      
        if (stone >= observationTowerPrice.stone && wood >= observationTowerPrice.wood) {
          stone -= observationTowerPrice.stone
          wood -= observationTowerPrice.wood
          explore(cursor.x, cursor.y, 3)
          B[strcoords(cursor.x, cursor.y)] = placing
        }
      }
    }else if(placing === 3){
      if(E[strcoords(cursor.x, cursor.y)] && O[strcoords(cursor.x, cursor.y)] === 1){
        if(stone >= sawmillPrice.stone && wood >= sawmillPrice.wood){
          woodIncreasing += 0.1
          stone -= sawmillPrice.stone
          wood -= sawmillPrice.wood
          explore(cursor.x, cursor.y, 1)
          B[strcoords(cursor.x, cursor.y)] = placing
          O[strcoords(cursor.x, cursor.y)] = 0
        }
      }
    }
    placing = 0
  } else if (e.button === 0 && !isDragging) {
    Clicked = true
    clickX = e.clientX
    clickY = e.clientY
  }
})
document.addEventListener('mousemove', e => {
  mouseX = e.clientX
  mouseY = e.clientY
  if (isDragging === true) {
    deltaX = e.clientX - lastX
    deltaY = e.clientY - lastY
    lastX = e.clientX
    lastY = e.clientY
    scrollingOffset.x += -hexcoords(deltaX, deltaY).x / _H * krat / 4
    scrollingOffset.y += -hexcoords(deltaX, deltaY).y / _H * krat / 4
  }
})

document.addEventListener('wheel', e => {
  if (e.deltaY !== 0) {
    krat = Math.floor(krat + e.deltaY / 10)
  }
  if (krat < 20) {
    krat = 20
  }
  if (krat > 60) {
    krat = 60
  }
})

document.addEventListener('contextmenu', e => {
  e.preventDefault()
  return false
}, false)

homeButton.addEventListener('mousedown', e => {
  if (!(scrollingOffset.x === 0 && scrollingOffset.y === 0)) {
    new TWEEN.Tween(scrollingOffset)
      .to({ x: 0, y: 0 }, 1000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(function () {
        offsetH = _H / 2 - a * hexcoords(focus.x + scrollingOffset.x, focus.y + scrollingOffset.y).y - a * 3 / 4
        offsetW = _W / 2 - a * hexcoords(focus.x + scrollingOffset.x, focus.y + scrollingOffset.y).x - a
      })
      .start()
    setTimeout(function () {
      cursor.x = basePosition.x
      cursor.y = basePosition.y
    }, 1000)
  } else {
    cursor.x = basePosition.x
    cursor.y = basePosition.y
  }
})

shopButton.addEventListener('click', e => {
  toggleShop = (toggleShop + 1) % 2
})

stonePitButton.addEventListener('click', e => {
  if (stone >= stonePitPrice.stone && wood >= stonePitPrice.wood) {
    toggleShop = 0
    placing = 1
  }
})

observationTowerButton.addEventListener('click', e => {
  if (stone >= observationTowerPrice.stone && wood >= observationTowerPrice.wood) {
    toggleShop = 0
    placing = 2
  }
})

sawmillButton.addEventListener('click', e => {
  if (stone >= sawmillPrice.stone && wood >= sawmillPrice.wood) {
    toggleShop = 0
    placing = 3
  }
})

loop()
