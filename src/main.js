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
const seaportButton = document.getElementById("seaport")
const ctx = c.getContext('2d')

// ----------------------
//    DRAWING OBJECTS:
// ----------------------

window.CanvasRenderingContext2D.prototype.roundRect = (x, y, width, height, radius) => {
  if (width < 2 * radius) radius = width / 2
  if (height < 2 * radius) radius = height / 2
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  return ctx
}

// Drawing Hexagons
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
  
  //Drawing only outline if it is a cursor
  if (type === 'normal') {
    ctx.stroke()
    ctx.fill()
  } else if (type === 'cursor' || type === 'placingCursor') {
    ctx.stroke()
  }
}
// Drawing Natural Objects
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
  }else if(type === 3){
    drawGoblin(x, y+s/4, s)
  }
}

// Drawing Placed Buildings
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
    ctx.strokeStyle = "black"
    ctx.fillStyle = "#66471d"
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(x-m*3, y)
    ctx.lineTo(x-m, y-m*2)
    ctx.lineTo(x-m, y-m*4)
    ctx.lineTo(x+m, y-m*4)
    ctx.lineTo(x+m*3, y-m*2)
    ctx.lineTo(x+m*3, y)
    ctx.lineTo(x-m*3, y)
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
  }else if(type === 4){
    const m = s/10
    const cellOffsetY = s/8
    ctx.strokeStyle = "black"
    ctx.lineWidth = m/2

    y -= cellOffsetY

    ctx.beginPath()
    ctx.arc(x, y-m*2, m, 0, 2*Math.PI)
    ctx.moveTo(x, y-m)
    ctx.lineTo(x, y+m*3)
    ctx.moveTo(x-m, y)
    ctx.lineTo(x+m, y)
    ctx.moveTo(x-m, y+m)
    ctx.lineTo(x-m*2, y+m)
    ctx.moveTo(x+m, y+m)
    ctx.lineTo(x+m*2, y+m)
    ctx.moveTo(x+m*2, y+m)
    ctx.closePath()
    
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(x, y+m*0.9, m*2, 0, 1*Math.PI)
    ctx.stroke()
  }
}

// Drawing Goblin
const drawGoblin =(x, y, s, goblinInfo = {color: "#1e526e", holdding: "nope"})=>{
  const m = s/10

  ctx.lineWidth = 1
  ctx.strokeStyle = "black"

  ctx.fillStyle = '#2e7521'
  ctx.beginPath()
  ctx.moveTo(x+m*2, y-m*8)
  ctx.lineTo(x+m*4, y-m*9)
  ctx.arc(x+m*1.5, y-m*9, m*3, 0, 0.5*Math.PI)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x-m*2, y-m*8)
  ctx.lineTo(x-m*4, y-m*9)
  ctx.arc(x-m*1.5, y-m*9, m*3, Math.PI, 0.5*Math.PI, true)
  ctx.moveTo(x+m*3, y-m*2.5)
  ctx.arc(x+m*2.5, y-m*2.5, m/2, 0, 2*Math.PI)
  ctx.moveTo(x-m*2, y-m*2.5)
  ctx.arc(x-m*2.5, y-m*2.5, m/2, 0, 2*Math.PI)
  ctx.moveTo(x-m/2, y)
  ctx.arc(x-m, y, m/2, 0, 2*Math.PI)
  ctx.moveTo(x+m*1.5, y)
  ctx.arc(x+m, y, m/2, 0, 2*Math.PI)
  ctx.moveTo(x-m*0.5, y-m*4)
  ctx.fillRect(x-m*0.5, y-m*4, m, m*0.5)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()


  ctx.fillStyle = '#30961e'
  ctx.beginPath()
  ctx.roundRect(x-m*3, y-m*9, m*6, m*5, m)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(x-m*1.75, y-m*3.5, m*3.5, m*3, m)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()

  ctx.fillStyle = "#b5f274"
  ctx.beginPath()
  ctx.moveTo(x+m*0.5, y-m*6)
  ctx.lineTo(x+m*2, y-m*7)
  ctx.lineTo(x+m*2, y-m*6.5)
  ctx.arc(x+m*0.5, y-m*6.5, m*1.5, 0, 0.5*Math.PI)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x-m*0.5, y-m*6)
  ctx.lineTo(x-m*2, y-m*7)
  ctx.lineTo(x-m*2, y-m*6.5)
  ctx.arc(x-m*0.5, y-m*6.5, m*1.5, Math.PI, 0.5*Math.PI, true)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = goblinInfo.color
  ctx.fillRect(x-m*3, y-m*8.5, m*6, m)
  ctx.beginPath()
  ctx.moveTo(x, y-m*5.5)
  ctx.arc(x-m*0.5, y-m*5.5, m/2, 0, 2*Math.PI)
  ctx.arc(x+m*0.5, y-m*5.5, m/2, Math.PI, 3*Math.PI)
  ctx.closePath()
  ctx.fill()

  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.moveTo(x-m, y-m*4.5)
  ctx.lineTo(x, y-m*4.75)
  ctx.lineTo(x+m, y-m*4.5)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()


}

// Checking if point is inside some hexagon
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

// Checking on what side of a line the point is
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

// ------------------------
//    TERRAIN GENERATION
// ------------------------

const simplex = new SimplexNoise()
const goblinCaves1 = new SimplexNoise()
const goblinCaves2 = new SimplexNoise()
const goblinCaves3 = new SimplexNoise()
const goblinCaves4 = new SimplexNoise()
const goblinCaves5 = new SimplexNoise()

let krat = 20

// biomes
let T = {}

// objects
let O = {}

// buildings
let B = {}

// explored terrain
let E = {}

// goblin caves
let G = {}

const basePosition = { x: 0, y: 0 }

const getSimplex = (S, x, y) => {
  return (S.noise2D(x / 12, y / 12))
}

const nearObjects = (x, y, object, radius) => {
  let count = 0
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && y + radius) && !(i === x && j === y)) {
        if (O[strcoords(i, j)] === undefined) {
          let x = getSimplex(simplex, i, j)
          if (x > 0) {
            if (x * 2 + 1 >= 1.25 && x * 2 + 1 < 2 && Math.floor((x * 2 + 1) * 10000) % 3 === 0) {
              O[strcoords(i, j)] = 1 // forest
            }else {
              O[strcoords(i, j)] = 0
            }
          }
        }
        if (O[strcoords(i, j)] === object) {
          count++
        }
      }
    }
  }
  return count
}

const generationLogics = (x, X, Y) => {
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
    }else {
      R.O = 0
    }
  } else {
    R.T = 0 // biome
    R.O = 0 // object
  }
  if(x * 2 + 1 >2.5 && G[strcoords(X, Y)]%15 === 0 && (G[strcoords(X, Y)]) >= 0 && nearObjects(X, Y, 3, 10)===0){
    R.O = 3 // goblixir well
    console.log("Goblin on xy: " + X + " " + Y)
  }
  return R
}

const generateCell = (x, y) => {
  G[strcoords(x, y)] = Math.floor(getSimplex(goblinCaves1, x, y)*10)*Math.floor(getSimplex(goblinCaves2, x, y)*10)*Math.floor(getSimplex(goblinCaves3, x, y)*10)*Math.floor(getSimplex(goblinCaves4, x, y)*10)*Math.floor(getSimplex(goblinCaves5, x, y)*10)
  T[strcoords(x, y)] = generationLogics(getSimplex(simplex, x, y), x, y).T
  if (x === basePosition.x && y === basePosition.y) {
    return 2
  } else {
    O[strcoords(x, y)] = generationLogics(getSimplex(simplex, x, y), x, y).O
  }
  

}

const generateStartingTerrain = () => {
  for (let i = basePosition.x - Math.floor(krat / 2); i < basePosition.x + Math.floor(krat / 2); i++) {
    for (let j = basePosition.y - Math.floor(krat / 2); j < basePosition.y + Math.floor(krat / 2); j++) {
      generateCell(i, j)
    }
  }
}

const nearBiomes = (x, y, biome, radius) => {
  let count = 0
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && j === y + radius) && !(i === x && j === y)) {
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

// Function For Discovering New Terrain (removing clouds)
const explore = (x, y, radius, how = "normal") => {
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && j === y + radius)) {
        if (T[strcoords(i, j)] === undefined) {
          generateCell(i, j)
        }
        if(how === "normal"){
          E[strcoords(i, j)] = 1
        }else if(how === "seaport"){
          if(T[strcoords(i, j)] === 0){
            E[strcoords(i, j)] = 1
          }
        }
      }
    }
  }
}

while (true) {
  const X = basePosition.x
  const f = getSimplex(simplex, X, 0)
  if (f * 2 + 1 >= 1.25 && f * 2 + 1 < 2 && Math.floor((f * 2 + 1) * 10000) % 3 !== 0) {
    if (nearObjects(X, 0, 1, 1) > 0 && nearBiomes(X, 0, 1, 1) > 2 && nearBiomes(X, 0, 0, 2) > 0 && nearBiomes(X, 0, 2, 2) === 0) {
      O[strcoords(basePosition.x, 0)] = 2 // main base
      break
    }
  }
  basePosition.x++
}

// Exploring near starting base at start
explore(basePosition.x, basePosition.y, 2)

// -----------------------
//    MAIN GAME EVENTS:
// -----------------------

// Setting variables
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

//Resource limits and given at start
let wood = 300
const woodLimit = 500
let stone = 300
const stoneLimit = 500

let stoneIncreasing = 0
let woodIncreasing = 0

//Object Prices
const stonePitPrice = { wood: 30, stone: 40 }
const observationTowerPrice = { wood: 100, stone: 120 }
const sawmillPrice = { wood: 20, stone: 30 }
const seaportPrice = { wood: 150, stone: 200 }

let time = Date.now()
let lastTime = Date.now()

// GAME LOOP
const loop = (tick) => {
  window.requestAnimationFrame(loop)
  time = Date.now()

  if (time - lastTime > 200) {
    stone = Math.min(stoneLimit, stone + stoneIncreasing)
    wood = Math.min(woodLimit, wood + woodIncreasing)
    lastTime = time
  }

  _W = window.innerWidth
  _H = window.innerHeight
  a = _H / krat * 2

  offsetH = _H / 2 - a * hexcoords(focus.x + scrollingOffset.x, focus.y + scrollingOffset.y).y - a * 3 / 4
  offsetW = _W / 2 - a * hexcoords(focus.x + scrollingOffset.x, focus.y + scrollingOffset.y).x - a

  c.width = _W
  c.height = _H
 
  // SHOP EVENTS
  if (toggleShop === 1) { 
    // SHOP GUI RENDERING
    // Screen Clearing
    ctx.fillStyle = '#699129'
    ctx.fillRect(0, 0, _W, _H)
	
	// Drawing shop background
    ctx.fillStyle = '#78a62e'
    ctx.beginPath()
    ctx.roundRect(20, 20, _W - 40, _H - 40, 20)
    ctx.closePath()
    ctx.fill()

    // Drawing wood storage indicator in shop
    ctx.beginPath()
    ctx.roundRect(_W - 230, 30, wood / woodLimit * 200, 30, 10)
    ctx.closePath()
    ctx.fillStyle = '#9c772d'
    ctx.fill()
    ctx.beginPath()
    ctx.roundRect(_W - 230, 30, 200, 30, 10)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.stroke()
    drawObject(_W - 215, 50, 25, 1)
    ctx.font = "15px Courier";
    ctx.fillStyle = "black"
    ctx.fillText(Math.floor(wood.toString()), _W - 200, 50);
	
    // Drawing stone storage indicator in shop
    ctx.beginPath()
    ctx.roundRect(_W - 440, 30, stone / stoneLimit * 200, 30, 10)
    ctx.closePath()
    ctx.fillStyle = '#525252'
    ctx.fill()
    ctx.beginPath()
    ctx.roundRect(_W - 440, 30, 200, 30, 10)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.font = "15px Courier";
    ctx.fillStyle = "black"
    ctx.fillText(Math.floor(stone.toString()), _W - 410, 50);
	
	// Drawing rest of the shop
    document.getElementById('home').style.display = 'none'
    stonePitButton.style.display = 'block'
    observationTowerButton.style.display = 'block'
    sawmillButton.style.display = 'block'
    seaportButton.style.display = 'block'

    const shopButtonWidth = parseInt(window.getComputedStyle(stonePitButton).width)
    const shopButtonHeight = parseInt(window.getComputedStyle(stonePitButton).height)
    const shopButtonY = parseInt(window.getComputedStyle(stonePitButton).top)
    const stonePitX = parseInt(window.getComputedStyle(stonePitButton).left)
    const sawmillX = parseInt(window.getComputedStyle(sawmillButton).left)
    const seaportX = parseInt(window.getComputedStyle(seaportButton).left)
    const observationTowerX = parseInt(window.getComputedStyle(observationTowerButton).left)
    drawBuilding(stonePitX + shopButtonWidth/2, shopButtonY + shopButtonHeight*2 + 10, shopButtonHeight*4/3, 1)
    drawBuilding(sawmillX + shopButtonWidth/2, shopButtonY + shopButtonHeight*2 + 10, shopButtonHeight*4/3, 3)
    drawBuilding(observationTowerX + shopButtonWidth/2, shopButtonY + shopButtonHeight*2 + 10, shopButtonHeight*4/3, 2)
    drawBuilding(seaportX + shopButtonWidth/2, shopButtonY + shopButtonHeight*1.75 + 10, shopButtonHeight*4/3, 4)

  } 
  
  // IMPORTANT GAME UPDATE FEATURES
  else if (toggleShop === 0) {
    document.getElementById('home').style.display = 'block'
    stonePitButton.style.display = 'none'
    observationTowerButton.style.display = 'none'
    sawmillButton.style.display = 'none'
    seaportButton.style.display = 'none'
    // clear screen
    ctx.fillStyle = '#0000FF'
    ctx.fillRect(0, 0, _W, _H)
    // render Tarrain
    for (let i = Math.floor(focus.x + scrollingOffset.x) - Math.floor(Math.max(_W, _H) / Math.min(_W, _H) * krat / 3); i <= Math.floor(focus.x + scrollingOffset.x) + Math.floor(Math.max(_W, _H) / Math.min(_W, _H) * krat / 3) + 1; i++) {
      for (let j = Math.floor(focus.y + scrollingOffset.y) - Math.floor(Math.max(_W, _H) / Math.min(_W, _H) * krat / 3); j <= Math.floor(focus.y + scrollingOffset.y) + Math.floor(Math.max(_W, _H) / Math.min(_W, _H) * krat / 3) + 1; j++) {
        if (Clicked && checkPointInHexagon(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, clickX, clickY)) {
          if (cursor.x === i && cursor.y === j) {
            cursor = { x: 'nope', y: 'nope' }
          } 
		  else {
            cursor.x = i
            cursor.y = j
            console.log(i, j)
          }
          Clicked = false
        }

        if (offsetW + a * hexcoords(i, j).x + a > 0 && offsetH + a * hexcoords(i, j).y + a > 0 && offsetW + a * hexcoords(i, j).x - a < _W && offsetH + a * hexcoords(i, j).y - a < _H) {
          if (T[strcoords(i, j)] === undefined || O[strcoords(i, j)] === undefined) {
            generateCell(i, j)
          }
          if (E[strcoords(i, j)] === 1) {
            drawHexagon(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, T[strcoords(i, j)])
            // if(G[strcoords(i, j)]%15 === 0 && (G[strcoords(i, j)]) >= 0){
            //   drawHexagon(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, 'brown')
            // }//tunnels
            drawObject(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a, O[strcoords(i, j)])
            drawBuilding(offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a, B[strcoords(i, j)])
            
            
          } 
		  else {
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
        ctx.beginPath()
        ctx.roundRect(_W * 0.99 - 200, _H * 0.03 + 60, 200, _H * 0.3, 10)
        ctx.closePath()
        ctx.fillStyle = '#a6935a'
        ctx.fill()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.lineWidth = 1
        drawObject(_W * 0.99 - 100, _H * 0.06 + 60, _H * 0.04, O[strcoords(cursor.x, cursor.y)])
      }
    } 
	else {
      // draw cursor (green/red)
      if (Math.floor(time) % 800 < 700) {
        if(placing === 1){
          if (E[strcoords(cursor.x, cursor.y)] && (T[strcoords(cursor.x, cursor.y)] === 1 || T[strcoords(cursor.x, cursor.y)] === 2) && O[strcoords(cursor.x, cursor.y)] === 0) {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }
		else if(placing === 2){
          if (E[strcoords(cursor.x, cursor.y)] && T[strcoords(cursor.x, cursor.y)] === 2 && O[strcoords(cursor.x, cursor.y)] === 0) {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }
		else if(placing === 3){
          if (E[strcoords(cursor.x, cursor.y)] && O[strcoords(cursor.x, cursor.y)] === 1) {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }
		else if(placing === 4){
          if (E[strcoords(cursor.x, cursor.y)] && nearBiomes(cursor.x, cursor.y, 0, 1) > 0 && T[strcoords(cursor.x, cursor.y)] !== 0 && O[strcoords(cursor.x, cursor.y)] === 0) {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }
      }
    }
    // wood storage
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.roundRect(_W * 0.99 - 200, _H * 0.01, wood / woodLimit * 200, 30, 10)
    ctx.closePath()
    ctx.fillStyle = '#9c772d'
    ctx.fill()
    ctx.beginPath()
    ctx.roundRect(_W * 0.99 - 200, _H * 0.01, 200, 30, 10)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.stroke()
    drawObject(_W * 0.99 - 185, _H * 0.01 + 20, 25, 1)
    ctx.font = "15px Courier";
    ctx.fillStyle = "black"
    ctx.fillText(Math.floor(wood.toString()), _W * 0.99 - 170, _H * 0.01 + 20);
    // stone storage
    ctx.beginPath()
    ctx.roundRect(_W * 0.99 - 200, _H * 0.02 + 30, stone / stoneLimit * 200, 30, 10)
    ctx.closePath()
    ctx.fillStyle = '#525252'
    ctx.fill()
    ctx.beginPath()
    ctx.roundRect(_W * 0.99 - 200, _H * 0.02 + 30, 200, 30, 10)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.font = "15px Courier";
    ctx.fillStyle = "black"
    ctx.fillText(Math.floor(stone.toString()), _W * 0.99 - 170, _H * 0.02 + 50);

    TWEEN.update(tick)
  }
}
loop()

// -----------------------------------
//     MOUSE DRAGGING AND SCROLLING
// -----------------------------------

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

//Block Placing Logic
c.addEventListener('mousedown', e => {
  if (e.button === 2) {
    lastX = e.clientX
    lastY = e.clientY
    isDragging = true
  } 
  else if (placing !== 0) {
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
    }
	else if (placing === 2) {
      if (E[strcoords(cursor.x, cursor.y)] && T[strcoords(cursor.x, cursor.y)] === 2 && O[strcoords(cursor.x, cursor.y)] === 0) {      
        if (stone >= observationTowerPrice.stone && wood >= observationTowerPrice.wood) {
          stone -= observationTowerPrice.stone
          wood -= observationTowerPrice.wood
          explore(cursor.x, cursor.y, 3)
          B[strcoords(cursor.x, cursor.y)] = placing
        }
      }
    }
	else if(placing === 3){
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
	else if(placing === 4){
      if(E[strcoords(cursor.x, cursor.y)] && nearBiomes(cursor.x, cursor.y, 0, 1) > 0 && T[strcoords(cursor.x, cursor.y)] !== 0 && O[strcoords(cursor.x, cursor.y)] === 0){
        if (stone >= seaportPrice.stone && wood >= seaportPrice.wood) {
          stone -= seaportPrice.stone
          wood -= seaportPrice.wood
          explore(cursor.x, cursor.y, 5, "seaport")
          explore(cursor.x, cursor.y, 1)
          B[strcoords(cursor.x, cursor.y)] = placing
        }
      }
    }
    placing = 0
  } 
  else if (e.button === 0 && !isDragging) {
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
  } 
  else {
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

seaportButton.addEventListener('click', e => {
  if (stone >= seaportPrice.stone && wood >= seaportPrice.wood) {
    toggleShop = 0
    placing = 4
  }
})


