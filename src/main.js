import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
// import '@fortawesome/fontawesome-free/js/regular'
// import '@fortawesome/fontawesome-free/js/brands'
import SimplexNoise from 'simplex-noise'
import TWEEN from '@tweenjs/tween.js'
const graphics = require('./graphics.js')
const roundRect = graphics.roundRect
const drawHexagon = graphics.drawHexagon
const drawObject = graphics.drawObject
const drawBuilding = graphics.drawBuilding
const drawGoblin = graphics.drawGoblin

const c = document.getElementById('myCanvas')
const ctx = c.getContext('2d')

const homeButton = document.getElementById('home')
const shopButton = document.getElementById('shop')
const stonePitButton = document.getElementById('stonePit')
const outpostButton = document.getElementById('outpost')
const sawmillButton = document.getElementById('sawmill')
const seaportButton = document.getElementById('seaport')

const stonePitPrice = { wood: 30, stone: 40 }
const outpostPrice = { wood: 100, stone: 120 }
const sawmillPrice = { wood: 20, stone: 30 }
const seaportPrice = { wood: 150, stone: 200 }
const housePrice = { wood: 20, stone: 10 }


const shopOffers = [
  {
    name: "stonePit",
    type: "building",
    num: 1,
    left: 30,
    width: 200,
    price:stonePitPrice
  },
  {
    name: "sawmill",
    type: "building",
    num: 3,
    left: 250,
    width: 200,
    price:sawmillPrice
  },
  {
    name: "outpost",
    type: "building",
    num: 2,
    left:470,
    width: 200,
    price:outpostPrice
  },
  {
    name: "seaport",
    type: "building",
    num: 4,
    left: 690,
    width: 200,
    price:seaportPrice
  },
  {
    name: "house",
    type: "building",
    num: 5,
    left: 910,
    width: 200,
    price:housePrice
  }
]


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
const goblinCaves = new SimplexNoise()

let krat = 20

// biomes 0-water 1-plains 2-mountains 4-beach
const T = {}

// objects 1-forest 3-goblin
const O = {}

// buildings  1-stonePit 2-outpost 3-sawmill 4-seaport 5-house 6-base
const B = {}

// explored terrain 0-"cloudy" 1-explored
const E = {}

// goblin caves 
const G = {}

const basePosition = { x: 0, y: 0 }

const getSimplex = (S, x, y, z = 0) => {
  return (S.noise3D(x / 12, y / 12, z))
}

const nearObjects = (x, y, object, radius) => {
  let count = 0
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && y + radius) && !(i === x && j === y)) {
        if (O[strcoords(i, j)] === undefined) {
          const x = getSimplex(simplex, i, j)
          if (x > 0) {
            if (x * 2 + 1 >= 1.25 && x * 2 + 1 < 2 && Math.floor((x * 2 + 1) * 10000) % 3 === 0) {
              O[strcoords(i, j)] = 1 // forest
            } else {
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
    if (x >= 0 && x < 0.5) {
      R.T = 1 // plains
    } else if (x >= 0.5) {
      R.T = 2 // mountains
    } else {
      R.T = 0
    }
    if (x > 0 && x < 0.125) {
      R.T = 4 // beach
    }

    if (x  >= 0.125 && x < 0.5 && Math.floor(x * 10000) % 3 === 0) {
      R.O = 1 // forest
    } else {
      R.O = 0
    }
  } else {
    R.T = 0 // biome
    R.O = 0 // object
  }
  if (x > 0.75 && (G[strcoords(X, Y)]) >= 0 && nearObjects(X, Y, 3, 5) === 0) {
    R.O = 3 // goblixir well
    //console.log('Goblin on xy: ' + X + ' ' + Y)
  }
  return R
}

const generateCell = (x, y) => {
  G[strcoords(x, y)] = Math.floor(getSimplex(goblinCaves, x, y, getSimplex(simplex, x, y)*5)*10)
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

generateStartingTerrain()

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
const nearBuildings = (x, y, building, radius) => {
  let count = 0
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && j === y + radius) && !(i === x && j === y)) {
        if (B[strcoords(i, j)] === building) {
          count++
        }
      }
    }
  }
  return count
}

const explore = (x, y, radius, how = 'normal') => {
  for (let i = x - radius; i <= x + radius; i++) {
    for (let j = y - radius; j <= y + radius; j++) {
      if (!(i === x - radius && j === y - radius) && !(i === x + radius && j === y + radius)) {
        if (T[strcoords(i, j)] === undefined) {
          generateCell(i, j)
        }
        if (how === 'normal') {
          E[strcoords(i, j)] = 1
        } else if (how === 'seaport') {
          if (T[strcoords(i, j)] === 0 || T[strcoords(i, j)] === 4) {
            E[strcoords(i, j)] = 1
          }
        }
      }
    }
  }
}

while (true) {
  basePosition.x++
  const X = basePosition.x
  const f = getSimplex(simplex, X, 0)
  if (f >= 0.13 && f < 1 && Math.floor((f) * 10000) % 3 !== 0) {
    B[strcoords(X, 0)] = 6 // main base
    O[strcoords(X, 0)] = 0
    break
  }
}

explore(basePosition.x, basePosition.y, 3)

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


let time = Date.now()
let lastTime = Date.now()
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

  if (toggleShop === 1) {
    // shop gui
    // clear screen
    ctx.fillStyle = '#699129'
    ctx.fillRect(0, 0, _W, _H)

    ctx.fillStyle = '#78a62e'
    ctx.beginPath()
    roundRect(ctx, 20, 20, _W - 40, _H - 40, 20)
    ctx.closePath()
    ctx.fill()

    // wood storage
    ctx.beginPath()
    roundRect(ctx, _W - 230, 30, wood / woodLimit * 200, 30, 10)
    ctx.closePath()
    ctx.fillStyle = '#9c772d'
    ctx.fill()
    ctx.beginPath()
    roundRect(ctx, _W - 230, 30, 200, 30, 10)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.stroke()
    drawObject(ctx, _W - 215, 50, 25, 1)
    ctx.font = '15px Courier'
    ctx.fillStyle = 'black'
    ctx.fillText(Math.floor(wood).toString(), _W - 200, 50)
    // stone storage
    ctx.beginPath()
    roundRect(ctx, _W - 440, 30, stone / stoneLimit * 200, 30, 10)
    ctx.closePath()
    ctx.fillStyle = '#525252'
    ctx.fill()
    ctx.beginPath()
    roundRect(ctx, _W - 440, 30, 200, 30, 10)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.font = '15px Courier'
    ctx.fillStyle = 'black'
    ctx.fillText(Math.floor(stone).toString(), _W - 410, 50)

    document.getElementById('home').style.display = 'none'
    for(let offer of shopOffers){
      const width = offer.width
      const height = 100
      const offsetX = offer.left
      let offsetY = 70
      document.getElementById(offer.name).style.display = 'block'
      document.getElementById(offer.name).style.width = offer.width
      if(offer.type == "building"){
        if(offer.num == 4){
          drawBuilding(ctx, offsetX+width/2, offsetY+height*1.75+10, height*4/3, offer.num)
        }else{
          drawBuilding(ctx, offsetX+width/2, offsetY+height*2+10, height*4/3, offer.num)
        }
      }
      ctx.font = "30px Courier New";
      ctx.strokeStyle = "black"
      ctx.lineWidth = 1

      ctx.fillStyle = '#9c772d'
      ctx.fillText(offer.price.wood.toString(), offsetX, offsetY + height * 2 + 75)
      ctx.strokeText(offer.price.wood.toString(), offsetX, offsetY + height * 2 + 75)
      ctx.fillStyle = '#525252'
      ctx.fillText(offer.price.stone.toString(), offsetX+75, offsetY + height * 2 + 75)
      ctx.strokeText(offer.price.stone.toString(), offsetX+75, offsetY + height * 2 + 75)
    }
  } else if (toggleShop === 0) {
    document.getElementById('home').style.display = 'block'
    for(const offer of shopOffers){
      document.getElementById(offer.name).style.display = 'none'
    }
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
            console.log(i, j)
            console.log(G[strcoords(i, j)])
          }
          Clicked = false
        }

        if (offsetW + a * hexcoords(i, j).x + a > 0 && offsetH + a * hexcoords(i, j).y + a > 0 && offsetW + a * hexcoords(i, j).x - a < _W && offsetH + a * hexcoords(i, j).y - a < _H) {
          if (T[strcoords(i, j)] === undefined || O[strcoords(i, j)] === undefined) {
            generateCell(i, j)
          }
          if (E[strcoords(i, j)] === 1) {
            drawHexagon(ctx, offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, T[strcoords(i, j)])
            // if((G[strcoords(i, j)]) >= 0){
            //   drawHexagon(ctx, offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, 'brown')
            // }//tunnels
            drawObject(ctx, offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a, O[strcoords(i, j)])
            drawBuilding(ctx, offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a, B[strcoords(i, j)])
          } else {
            if (T[strcoords(i, j)] <= 0) {
              drawHexagon(ctx, offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, '#e0e0e0')
            } else {
              drawHexagon(ctx, offsetW + a * hexcoords(i, j).x, offsetH + a * hexcoords(i, j).y, a * 2, '#cccccc')
            }
          }
        }
        // placing cursor while moving
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
        drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'black', 'cursor')

        // cell info
        ctx.beginPath()
        roundRect(ctx, _W * 0.99 - 200, _H * 0.03 + 60, 200, _H * 0.3, 10)
        ctx.closePath()
        ctx.fillStyle = '#a6935a'
        ctx.fill()
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.lineWidth = 1
        drawBuilding(ctx, _W * 0.99 - 100, _H * 0.06 + 160, _H * 0.3, 5)
      }
    } else {
      // draw cursor (green/red)
      if (Math.floor(time) % 800 < 700) {
        if (placing === 1) {
          if (E[strcoords(cursor.x, cursor.y)] && (T[strcoords(cursor.x, cursor.y)] === 1 || T[strcoords(cursor.x, cursor.y)] === 2) && O[strcoords(cursor.x, cursor.y)] === 0) {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        } else if (placing === 2) {
          if (E[strcoords(cursor.x, cursor.y)] && T[strcoords(cursor.x, cursor.y)] === 2 && O[strcoords(cursor.x, cursor.y)] === 0) {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        } else if (placing === 3) {
          if (E[strcoords(cursor.x, cursor.y)] && O[strcoords(cursor.x, cursor.y)] === 1) {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        } else if (placing === 4) {
          if (E[strcoords(cursor.x, cursor.y)] && nearBiomes(cursor.x, cursor.y, 0, 1) > 0 && T[strcoords(cursor.x, cursor.y)] !== 0 && O[strcoords(cursor.x, cursor.y)] === 0) {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }else if(placing === 5){
          if (E[strcoords(cursor.x, cursor.y)] && T[strcoords(cursor.x, cursor.y)] !== 0 && O[strcoords(cursor.x, cursor.y)] === 0 && (nearBuildings(cursor.x, cursor.y, 5, 1)>0||nearBuildings(cursor.x, cursor.y, 6, 1)>0)) {
            console.log(nearObjects(cursor.x, cursor.y, 2, 1), nearBuildings(cursor.x, cursor.y, 5, 1))
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'lightgreen', 'cursor')
          } else {
            drawHexagon(ctx, offsetW + a * hexcoords(cursor.x, cursor.y).x, offsetH + a * hexcoords(cursor.x, cursor.y).y, a * 2, 'red', 'cursor')
          }
        }
      }
    }
    // wood storage
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    roundRect(ctx, _W * 0.99 - 200, _H * 0.01, wood / woodLimit * 200, 30, 10)
    ctx.closePath()
    ctx.fillStyle = '#9c772d'
    ctx.fill()
    ctx.beginPath()
    roundRect(ctx, _W * 0.99 - 200, _H * 0.01, 200, 30, 10)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.stroke()
    drawObject(ctx, _W * 0.99 - 185, _H * 0.01 + 20, 25, 1)
    ctx.font = '15px Courier'
    ctx.fillStyle = 'black'
    ctx.fillText(Math.floor(wood.toString()), _W * 0.99 - 170, _H * 0.01 + 20)
    // stone storage
    ctx.beginPath()
    roundRect(ctx, _W * 0.99 - 200, _H * 0.02 + 30, stone / stoneLimit * 200, 30, 10)
    ctx.closePath()
    ctx.fillStyle = '#525252'
    ctx.fill()
    ctx.beginPath()
    roundRect(ctx, _W * 0.99 - 200, _H * 0.02 + 30, 200, 30, 10)
    ctx.closePath()
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.font = '15px Courier'
    ctx.fillStyle = 'black'
    ctx.fillText(Math.floor(stone.toString()), _W * 0.99 - 170, _H * 0.02 + 50)

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
          B[strcoords(cursor.x, cursor.y)] = placing
        }
      }
    } else if (placing === 2) {
      if (E[strcoords(cursor.x, cursor.y)] && T[strcoords(cursor.x, cursor.y)] === 2 && O[strcoords(cursor.x, cursor.y)] === 0) {
        if (stone >= outpostPrice.stone && wood >= outpostPrice.wood) {
          stone -= outpostPrice.stone
          wood -= outpostPrice.wood
          explore(cursor.x, cursor.y, 4)
          B[strcoords(cursor.x, cursor.y)] = placing
        }
      }
    } else if (placing === 3) {
      if (E[strcoords(cursor.x, cursor.y)] && O[strcoords(cursor.x, cursor.y)] === 1) {
        if (stone >= sawmillPrice.stone && wood >= sawmillPrice.wood) {
          woodIncreasing += 0.1
          stone -= sawmillPrice.stone
          wood -= sawmillPrice.wood
          B[strcoords(cursor.x, cursor.y)] = placing
          O[strcoords(cursor.x, cursor.y)] = 0
        }
      }
    } else if (placing === 4) {
      if (E[strcoords(cursor.x, cursor.y)] && nearBiomes(cursor.x, cursor.y, 0, 1) > 0 && T[strcoords(cursor.x, cursor.y)] !== 0 && O[strcoords(cursor.x, cursor.y)] === 0) {
        if (stone >= seaportPrice.stone && wood >= seaportPrice.wood) {
          stone -= seaportPrice.stone
          wood -= seaportPrice.wood
          explore(cursor.x, cursor.y, 5, 'seaport')
          explore(cursor.x, cursor.y, 1)
          B[strcoords(cursor.x, cursor.y)] = placing
        }
      }
    }else if (placing === 5) {
      if (E[strcoords(cursor.x, cursor.y)] && T[strcoords(cursor.x, cursor.y)] !== 0 && O[strcoords(cursor.x, cursor.y)] === 0 && (nearBuildings(cursor.x, cursor.y, 5, 1)>0||nearBuildings(cursor.x, cursor.y, 6, 1)>0)) {
        if (stone >= housePrice.stone && wood >= housePrice.wood) {
          stone -= housePrice.stone
          wood -= housePrice.wood
          explore(cursor.x, cursor.y, 2)
          B[strcoords(cursor.x, cursor.y)] = placing
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

for(const offer of shopOffers){
  document.getElementById(offer.name).addEventListener('click', e => {
    if (stone >= offer.price.stone && wood >= offer.price.wood) {
      toggleShop = 0
      placing = offer.num
    }
  })
}

shopButton.addEventListener('click', e => {
  toggleShop = (toggleShop + 1) % 2
})

loop()
