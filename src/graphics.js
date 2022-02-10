const roundRect = (ctx, x, y, width, height, radius) => {
  if (width < 2 * radius) radius = width / 2
  if (height < 2 * radius) radius = height / 2
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
}

const drawHexagon = (ctx, x, y, s, biome, type = 'normal') => {
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
const drawObject = (ctx, x, y, s, type) => {
  if (type === 1) { // forest
    ctx.fillStyle = '#4f2602'
    ctx.strokeStyle = 'black'
    ctx.fillRect(x - s / 6, y - s / 6, s / 3, s / 3)
    ctx.strokeRect(x - s / 6, y - s / 6, s / 3, s / 3)

    ctx.fillStyle = '#248016'
    ctx.beginPath()
    ctx.arc(x, y - s * 3 / 12, s / 3, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  } else if (type === 2) { // main base
    s /= 2
    ctx.fillStyle = 'gray'
    ctx.strokeStyle = 'black'
    ctx.fillRect(x - s, y - s, s * 2, s)
    ctx.strokeRect(x - s, y - s, s * 2, s)
  } else if (type === 3) {
    drawGoblin(x, y + s / 4, s)
  }
}

const drawBuilding = (ctx, x, y, s, type) => {
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
  } else if (type === 3) {
    const m = s / 15
    ctx.strokeStyle = 'black'
    ctx.fillStyle = '#66471d'
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(x - m * 3, y)
    ctx.lineTo(x - m, y - m * 2)
    ctx.lineTo(x - m, y - m * 4)
    ctx.lineTo(x + m, y - m * 4)
    ctx.lineTo(x + m * 3, y - m * 2)
    ctx.lineTo(x + m * 3, y)
    ctx.lineTo(x - m * 3, y)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#c4a458'

    ctx.beginPath()
    ctx.moveTo(x - m * 6, y - m)
    ctx.arc(x - m * 5, y - m, m, 0, Math.PI)
    ctx.moveTo(x + m * 4, y - m)
    ctx.arc(x + m * 5, y - m, m, 0, Math.PI)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#6e4f10'

    ctx.beginPath()
    ctx.moveTo(x - m * 4, y - m)
    ctx.lineTo(x - m * 3, y - m)
    ctx.arc(x - m * 4, y - m, m, 0, 0.5 * Math.PI)
    ctx.lineTo(x - m * 5, y)
    ctx.arc(x - m * 5, y - m, m, 0.5 * Math.PI, 0, true)

    ctx.moveTo(x + m * 6, y - m)
    ctx.lineTo(x + m * 7, y - m)
    ctx.arc(x + m * 6, y - m, m, 0, 0.5 * Math.PI)
    ctx.lineTo(x + m * 5, y)
    ctx.arc(x + m * 5, y - m, m, 0.5 * Math.PI, 0, true)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#6e6e6e'

    ctx.beginPath()
    ctx.moveTo(x, y - m * 4)
    ctx.lineTo(x + m, y - m * 5)
    ctx.lineTo(x + m, y - m * 5.5)
    ctx.lineTo(x, y - m * 6)
    ctx.lineTo(x - m, y - m * 5)
    ctx.lineTo(x - m * 0.5, y - m * 4)

    ctx.moveTo(x - m * 0.5, y - m * 6.5)
    ctx.lineTo(x - m * 1.5, y - m * 6.5)
    ctx.lineTo(x - m * 1.5, y - m * 5.5)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#6e4f10'

    ctx.beginPath()
    ctx.moveTo(x - m * 1.5, y - m * 4.5)
    ctx.lineTo(x - m * 1.75, y - m * 5.25)
    ctx.lineTo(x + m * 2.5, y - m * 9.5)
    ctx.lineTo(x + m * 3, y - m * 9)
    ctx.lineTo(x - m * 1.5, y - m * 4.5)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()
  } else if (type === 4) {
    const m = s / 10
    const cellOffsetY = s / 8
    ctx.strokeStyle = 'black'
    ctx.lineWidth = m / 2

    y -= cellOffsetY

    ctx.beginPath()
    ctx.arc(x, y - m * 2, m, 0, 2 * Math.PI)
    ctx.moveTo(x, y - m)
    ctx.lineTo(x, y + m * 3)
    ctx.moveTo(x - m, y)
    ctx.lineTo(x + m, y)
    ctx.moveTo(x - m, y + m)
    ctx.lineTo(x - m * 2, y + m)
    ctx.moveTo(x + m, y + m)
    ctx.lineTo(x + m * 2, y + m)
    ctx.moveTo(x + m * 2, y + m)
    ctx.closePath()

    ctx.stroke()

    ctx.beginPath()
    ctx.arc(x, y + m * 0.9, m * 2, 0, 1 * Math.PI)
    ctx.stroke()
  }
}

const drawGoblin = (ctx, x, y, s, goblinInfo = { color: '#1e526e', holdding: 'nope' }) => {
  const m = s / 10

  ctx.lineWidth = 1
  ctx.strokeStyle = 'black'

  ctx.fillStyle = '#2e7521'
  ctx.beginPath()
  ctx.moveTo(x + m * 2, y - m * 8)
  ctx.lineTo(x + m * 4, y - m * 9)
  ctx.arc(x + m * 1.5, y - m * 9, m * 3, 0, 0.5 * Math.PI)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x - m * 2, y - m * 8)
  ctx.lineTo(x - m * 4, y - m * 9)
  ctx.arc(x - m * 1.5, y - m * 9, m * 3, Math.PI, 0.5 * Math.PI, true)
  ctx.moveTo(x + m * 3, y - m * 2.5)
  ctx.arc(x + m * 2.5, y - m * 2.5, m / 2, 0, 2 * Math.PI)
  ctx.moveTo(x - m * 2, y - m * 2.5)
  ctx.arc(x - m * 2.5, y - m * 2.5, m / 2, 0, 2 * Math.PI)
  ctx.moveTo(x - m / 2, y)
  ctx.arc(x - m, y, m / 2, 0, 2 * Math.PI)
  ctx.moveTo(x + m * 1.5, y)
  ctx.arc(x + m, y, m / 2, 0, 2 * Math.PI)
  ctx.moveTo(x - m * 0.5, y - m * 4)
  ctx.fillRect(x - m * 0.5, y - m * 4, m, m * 0.5)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#30961e'
  ctx.beginPath()
  ctx.roundRect(x - m * 3, y - m * 9, m * 6, m * 5, m)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(x - m * 1.75, y - m * 3.5, m * 3.5, m * 3, m)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()

  ctx.fillStyle = '#b5f274'
  ctx.beginPath()
  ctx.moveTo(x + m * 0.5, y - m * 6)
  ctx.lineTo(x + m * 2, y - m * 7)
  ctx.lineTo(x + m * 2, y - m * 6.5)
  ctx.arc(x + m * 0.5, y - m * 6.5, m * 1.5, 0, 0.5 * Math.PI)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x - m * 0.5, y - m * 6)
  ctx.lineTo(x - m * 2, y - m * 7)
  ctx.lineTo(x - m * 2, y - m * 6.5)
  ctx.arc(x - m * 0.5, y - m * 6.5, m * 1.5, Math.PI, 0.5 * Math.PI, true)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = goblinInfo.color
  ctx.fillRect(x - m * 3, y - m * 8.5, m * 6, m)
  ctx.beginPath()
  ctx.moveTo(x, y - m * 5.5)
  ctx.arc(x - m * 0.5, y - m * 5.5, m / 2, 0, 2 * Math.PI)
  ctx.arc(x + m * 0.5, y - m * 5.5, m / 2, Math.PI, 3 * Math.PI)
  ctx.closePath()
  ctx.fill()

  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.moveTo(x - m, y - m * 4.5)
  ctx.lineTo(x, y - m * 4.75)
  ctx.lineTo(x + m, y - m * 4.5)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

module.exports = {roundRect: roundRect, drawHexagon: drawHexagon, drawObject:drawObject, drawBuilding: drawBuilding, drawGoblin: drawGoblin}