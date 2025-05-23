let ballX = 75
let ballY = 75
let ballSpeedX = 5
let ballSpeedY = 7

const TRACK_WIDTH = 80
const TRACK_HEIGHT = 20
const TRACK_GAP = 2
const TRACK_COLS = 10
const TRACK_ROWS = 14

let trackGrid = new Array(TRACK_COLS * TRACK_ROWS)
let tracksLeft = 0
let canvas, ctx
let mouseX = 0
let mouseY = 0

function updateMousePos(event) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  mouseX = event.clientX - rect.left - root.scrollLeft
  mouseY = event.clientY - rect.top - root.scrollTop
}

function trackReset() {
  tracksLeft = 0

  for (let row = 0; row < TRACK_ROWS; row++) {
    for (let col = 0; col < TRACK_COLS; col++) {
      let trackIndex = row * TRACK_COLS + col
      if (row < 3) {
        trackGrid[trackIndex] = false
      } else {
        trackGrid[trackIndex] = true
        tracksLeft++
      }
    }
  }
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  let fps = 30
  setInterval(updateAll, 1000 / fps)

  canvas.addEventListener('mousemove', updateMousePos)    
  trackReset() 
  ballReset()
}

function updateAll() {
  moveAll()
  drawAll()
}

function ballReset() {
  ballX = canvas.width / 2
  ballY = canvas.height / 2
}

function ballMove() {
  ballX += ballSpeedX
  ballY += ballSpeedY

  if (ballX < 0 && ballSpeedX < 0.0) ballSpeedX *= -1
  if (ballX > canvas.width && ballSpeedX > 0.0) ballSpeedX *= -1
  if (ballY < 0 && ballSpeedY < 0.0) ballSpeedY *= -1
  if (ballY > canvas.height) {
    ballReset()
    trackReset()
  }
}

function isTrackAtColRow(col, row) {
  if (
    col >= 0 &&
    col < TRACK_COLS &&
    row >= 0 &&
    row < TRACK_ROWS
  ) {
    let trackIndexUnderCoord = rowColToArrayIndex(col, row)
    return trackGrid[trackIndexUnderCoord]
  } else {
    return false
  }
}

function ballTrackHandling() {
  let ballTrackCol = Math.floor(ballX / TRACK_WIDTH)
  let ballTrackRow = Math.floor(ballY / TRACK_HEIGHT)
  let trackIndexUnderBall = rowColToArrayIndex(ballTrackCol, ballTrackRow) 
  
  if (
    ballTrackCol >= 0 &&
    ballTrackCol < TRACK_COLS &&
    ballTrackRow >= 0 &&
    ballTrackRow < TRACK_ROWS
  ) {
    if (isTrackAtColRow(ballTrackCol, ballTrackRow)) {
      trackGrid[trackIndexUnderBall] = false
      tracksLeft--
    
      let prevBallX = ballX - ballSpeedX
      let prevBallY = ballY - ballSpeedY
      let prevTrackCol = Math.floor(prevBallX / TRACK_WIDTH)
      let prevTrackRow = Math.floor(prevBallY / TRACK_HEIGHT)

      let bothTestsFailed = true

      if (prevTrackCol != ballTrackCol) {
        if (isTrackAtColRow(prevTrackCol, ballTrackRow) == false) {
          ballSpeedX *= -1
          bothTestsFailed = false
        }
      }
      if (prevTrackRow != ballTrackRow) {
        if (isTrackAtColRow(prevTrackCol, ballTrackRow) == false) {
          ballSpeedY *= -1
          bothTestsFailed = false
        }
      }
      if (bothTestsFailed) {
        ballSpeedX *= -1
        ballSpeedY *= -1
      }
    }
  }
}
  
function moveAll() {
  ballMove()
  ballTrackHandling()
}
  
function rowColToArrayIndex(col, row) {
  return col + TRACK_COLS * row
}

function drawTracks() {
  for (let eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < TRACK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (trackGrid[arrayIndex]) {
        colourRect(
          TRACK_WIDTH * eachCol,
          TRACK_HEIGHT * eachRow,
          TRACK_WIDTH - TRACK_GAP,
          TRACK_HEIGHT - TRACK_GAP,
          '#ff4500'
        )
      }
    }
  }  
}

function drawAll() {
  colourRect(0, 0, canvas.width, canvas.height, '#000')
  colourCircle(ballX, ballY, 10, '#ffd700')
  drawTracks()
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