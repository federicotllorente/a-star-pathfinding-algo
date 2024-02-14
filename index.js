
const GRID_COLS = 5
const GRID_ROWS = 5
const SPOT_SIZE = 50 // 20

let canvas, grid

class Spot {
  constructor(i, j) {
    this.x = i
    this.y = j

    this.f = 0
    this.g = 0
    this.h = 0

    this.show = function(color) {
      // Print spot
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.lineWidth = 1
      ctx.strokeRect(this.x * SPOT_SIZE, this.y * SPOT_SIZE, SPOT_SIZE, SPOT_SIZE)
      ctx.fillRect(this.x * SPOT_SIZE, this.y * SPOT_SIZE, SPOT_SIZE - 1, SPOT_SIZE - 1)
    }
  }
}

const openSet = []
const closedSet = []
let start, end

function setup() {
  // Creating the canvas
  const app = document.getElementById('app')
  canvas = document.createElement('canvas')
  canvas.width = GRID_ROWS * SPOT_SIZE
  canvas.height = GRID_COLS * SPOT_SIZE
  app.appendChild(canvas)
  
  // Making a 2D array
  grid = new Array(GRID_COLS)
  for (let i = 0; i < GRID_COLS; i++) {
    grid[i] = new Array(GRID_ROWS)

    for (let j = 0; j < GRID_ROWS; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  // Set start and end
  start = grid[0][0]
  end = grid[GRID_COLS - 1][GRID_ROWS - 1]

  // Init open set
  openSet.push(start)
}

function loop() {
  if (openSet.length > 0) {
    // Keep going
  } else {
    // No solution
  }
  
  // Print all spots
  for (let i = 0; i < GRID_COLS; i++) {
    for (let j = 0; j < GRID_ROWS; j++) {
      grid[i][j].show('rgb(255, 255, 255)')
    }
  }

  // Print in red evaluated spots
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show('rgb(255, 0, 0)')
  }

  // Print in green non-evaluated spots
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show('rgb(0, 255, 0)')
  }
}

setup()
setInterval(loop, 1000);

// OPEN SET: nodes that NEED to be evaluated
// CLOSED SET: nodes that HAVE BEEN evaluated

// When to finish the process:
// 1. The destination node has been found (arrived)
// 2. The open set is empty, and the first point is not completed
// (That means there's no solution)
