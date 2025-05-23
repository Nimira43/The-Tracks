let ballX = 75
let ballY = 75
let ballSpeedX = 5
let ballSpeedY = 7

const BRICK_WIDTH = 80
const BRICK_HEIGHT = 20
const BRICK_GAP = 2
const BRICK_COLS = 10
const BRICK_ROWS = 14

let brickGrid = new Array(BRICK_COLS * BRICK_ROWS)
let bricksLeft = 0

const PADDLE_WIDTH = 100
const PADDLE_THICKNESS = 10
const PADDLE_DISTANCE_FROM_EDGE = 60
const PADDLE_SPEED = 30 // key based movement.
let paddleX = 400
let canvas, ctx
let mouseX = 0
let mouseY = 0

function updateMousePos(event) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  mouseX = event.clientX - rect.left - root.scrollLeft
  mouseY = event.clientY - rect.top - root.scrollTop
  paddleX = mouseX - PADDLE_WIDTH / 2
}

function updatePaddleMovement(event) {
  if (event.key === 'ArrowLeft') {
    paddleX -= PADDLE_SPEED
  } else if (event.key === 'ArrowRight') {
    paddleX += PADDLE_SPEED
  }
  if (paddleX < 0) {
    paddleX = 0
  } else if (paddleX > canvas.width - PADDLE_WIDTH) {
    paddleX = canvas.width - PADDLE_WIDTH
  }
}

function brickReset() {
  bricksLeft = 0

  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      let brickIndex = row * BRICK_COLS + col
      if (row < 3) {
        brickGrid[brickIndex] = false
      } else {
        brickGrid[brickIndex] = true
        bricksLeft++
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
  document.addEventListener('keydown', updatePaddleMovement)

  brickReset() 
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
    brickReset()
  }
}

function isBrickAtColRow(col, row) {
  if (
    col >= 0 &&
    col < BRICK_COLS &&
    row >= 0 &&
    row < BRICK_ROWS
  ) {
    let brickIndexUnderCoord = rowColToArrayIndex(col, row)
    return brickGrid[brickIndexUnderCoord]
  } else {
    return false
  }
}

function ballBrickHandling() {
  let ballBrickCol = Math.floor(ballX / BRICK_WIDTH)
  let ballBrickRow = Math.floor(ballY / BRICK_HEIGHT)
  let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow) 
  
  if (
    ballBrickCol >= 0 &&
    ballBrickCol < BRICK_COLS &&
    ballBrickRow >= 0 &&
    ballBrickRow < BRICK_ROWS
  ) {
    if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
      brickGrid[brickIndexUnderBall] = false
      bricksLeft--
    
      let prevBallX = ballX - ballSpeedX
      let prevBallY = ballY - ballSpeedY
      let prevBrickCol = Math.floor(prevBallX / BRICK_WIDTH)
      let prevBrickRow = Math.floor(prevBallY / BRICK_HEIGHT)

      let bothTestsFailed = true

      if (prevBrickCol != ballBrickCol) {
        if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
          ballSpeedX *= -1
          bothTestsFailed = false
        }
      }
      if (prevBrickRow != ballBrickRow) {
        if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
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

function ballPaddleHandling() {
  let paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS
  let paddleLeftEdgeX = paddleX
  let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH

  if (
    ballY > paddleTopEdgeY &&
    ballY < paddleBottomEdgeY &&
    ballX > paddleLeftEdgeX &&
    ballX < paddleRightEdgeX
  ) {
    ballSpeedY *= -1

    let centreOfPaddleX = paddleX + PADDLE_WIDTH / 2
    let ballDistanceFromPaddleCentreX = ballX - centreOfPaddleX
    ballSpeedX = ballDistanceFromPaddleCentreX * 0.35

    if (bricksLeft == 0) {
      brickReset()
    }
  } 
}
  
function moveAll() {
  ballMove()
  ballBrickHandling()
  ballPaddleHandling()
}
  
function rowColToArrayIndex(col, row) {
  return col + BRICK_COLS * row
}

function drawBricks() {
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (brickGrid[arrayIndex]) {
        colourRect(
          BRICK_WIDTH * eachCol,
          BRICK_HEIGHT * eachRow,
          BRICK_WIDTH - BRICK_GAP,
          BRICK_HEIGHT - BRICK_GAP,
          '#ff4500'
        )
      }
    }
  }  
}

function drawAll() {
  colourRect(0, 0, canvas.width, canvas.height, '#000')
  colourCircle(ballX, ballY, 10, '#ffd700')
  colourRect(paddleX, canvas.height - PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, '#fffcfa')
  drawBricks()
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