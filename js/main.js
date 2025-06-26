import { trackGrid } from './tracks/tracks.js'

let carImage = document.createElement('img')
let carImageLoaded = false
let carX = 75
let carY = 75
let carAng = 0
let carSpeed = 0

const TRACK_WIDTH = 40
const TRACK_HEIGHT = 40
const TRACK_GAP = 2
const TRACK_COLS = 20
const TRACK_ROWS = 15

let canvas, ctx
let mouseX = 0
let mouseY = 0

const KEY_LEFT = 37
const KEY_RIGHT = 39
const KEY_UP = 38
const KEY_DOWN = 40

let forward = false
let backward = false
let turnLeft = false
let turnRight = false

function updateMousePos(event) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  mouseX = event.clientX - rect.left - root.scrollLeft
  mouseY = event.clientY - rect.top - root.scrollTop
}

function keyPressed(event) {
  if (event.keyCode == KEY_LEFT) turnLeft = true
  if (event.keyCode == KEY_RIGHT) turnRight = true
  if (event.keyCode == KEY_UP) forward = true
  if (event.keyCode == KEY_DOWN) backward = true
  event.preventDefault()
}

function keyReleased(event) {
  if (event.keyCode == KEY_LEFT) turnLeft = false
  if (event.keyCode == KEY_RIGHT) turnRight = false
  if (event.keyCode == KEY_UP) forward = false
  if (event.keyCode == KEY_DOWN) backward = false
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  let fps = 30
  setInterval(updateAll, 1000 / fps)

  canvas.addEventListener('mousemove', updateMousePos)    
  document.addEventListener('keydown', keyPressed)
  document.addEventListener('keyup', keyReleased)
  carImage.onload = () => carImageLoaded = true
  
  // carImage.onload = function() {
  //   carImageLoaded = true
  // }
  carImage.src = '../images/car/car.png'
  carReset()
}

function updateAll() {
  moveAll()
  drawAll()
}

function carReset() {
  for (let eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
    for (var eachCol = 0; eachCol < TRACK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (trackGrid[arrayIndex] == 2) {
        trackGrid[arrayIndex] = 0
        carX = eachCol = TRACK_WIDTH + TRACK_WIDTH / 2
        carY = eachRow = TRACK_HEIGHT + TRACK_HEIGHT / 2
      }
    }
  } 
}

function carMove() {
  if (forward) carSpeed += 0.02
  if (backward) carSpeed -= 0.02
  if (turnLeft) carAng -= 0.04
  if (turnRight) carAng += 0.04
  carX += Math.cos(carAng) * carSpeed
  carY += Math.sin(carAng) * carSpeed
}

function isTrackAtColRow(col, row) {
  if (
    col >= 0 &&
    col < TRACK_COLS &&
    row >= 0 &&
    row < TRACK_ROWS
  ) {
    let trackIndexUnderCoord = rowColToArrayIndex(col, row)
    return (trackGrid[trackIndexUnderCoord] == 1)
  } else {
    return false
  }
}

function carTrackHandling() {
  let carTrackCol = Math.floor(carX / TRACK_WIDTH)
  let carTrackRow = Math.floor(carY / TRACK_HEIGHT)
  let trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow) 
  
  if (
    carTrackCol >= 0 &&
    carTrackCol < TRACK_COLS &&
    carTrackRow >= 0 &&
    carTrackRow < TRACK_ROWS
  ) {
    if (isTrackAtColRow(carTrackCol, carTrackRow)) {
      carSpeed *= -1
    }
  }
}
  
function moveAll() {
  carMove()
  carTrackHandling()
}
  
function rowColToArrayIndex(col, row) {
  return col + TRACK_COLS * row
}

function drawTracks() {
  for (let eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < TRACK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (trackGrid[arrayIndex] == 1) {
        colourRect(
          TRACK_WIDTH * eachCol,
          TRACK_HEIGHT * eachRow,
          TRACK_WIDTH - TRACK_GAP,
          TRACK_HEIGHT - TRACK_GAP,
          '#8b0000'
        )
      }
    }
  }  
}

function drawAll() {
  colourRect(0, 0, canvas.width, canvas.height, '#000')
  if (carImageLoaded) {
    drawBitmapCentredWithRotation(
      carImage,
      carX,
      carY,
      carAng
    )
  }
  drawTracks()
}

function drawBitmapCentredWithRotation(
  useBitmap, atX, atY, withAng
) {
  ctx.save()
  ctx.translate(atX, atY)
  ctx.rotate(withAng)
  ctx.drawImage(
    useBitmap,
    -useBitmap.width / 2,
    -useBitmap.height / 2
  )
  ctx.restore()
}

function colourRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColour) {
  ctx.fillStyle = fillColour
  ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
}

function colourCircle(centreX, centreY, radius, fillColour) {
  ctx.fillStyle = fillColour
  ctx.beginPath()
  ctx.arc(centreX, centreY, 10, 0, Math.PI * 2, true)
  ctx.fill()
}

function colourText(showWords, textX, textY, fillColour) {
  ctx.fillStyle = fillColour
  ctx.fillText(showWords, textX, textY)
}