
const GRID_COLS = 5
const GRID_ROWS = 5
const SPOT_SIZE = 50 // 20

class Spot {
  constructor(i, j) {
    this.x = i
    this.y = j

    this.f = 0
    this.g = 0
    this.h = 0

    this.show = function() {
      // Print spot
    }
  }
}

const openSet = []
const closedSet = []
let start, end

function setup() {
  // Creating the canvas
  const app = document.getElementById('app')
  const canvas = document.createElement('canvas')
  canvas.width = GRID_ROWS * SPOT_SIZE
  canvas.height = GRID_COLS * SPOT_SIZE
  app.appendChild(canvas)
  
  // Making a 2D array
  const grid = new Array(GRID_COLS)
  for (let i = 0; i < GRID_COLS; i++) {
    grid[i] = new Array(GRID_ROWS)

    for (let j = 0; j < GRID_ROWS; j++) {
      grid[i][j] = new Spot();
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
}

setup()

// OPEN SET: nodes that NEED to be evaluated
// CLOSED SET: nodes that HAVE BEEN evaluated

// When to finish the process:
// 1. The destination node has been found (arrived)
// 2. The open set is empty, and the first point is not completed
// (That means there's no solution)
