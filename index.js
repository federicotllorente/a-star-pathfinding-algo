const GRID_COLS = 10
const GRID_ROWS = 10
// const SPOT_SIZE = 50 // 20
const SPOT_SIZE = window.innerHeight < window.innerWidth
  ? (window.innerHeight - 16) / GRID_ROWS
  : (window.innerWidth - 16) / GRID_COLS

let openSet = [] // TODO Don't use let, use const, but I need a removeFromArray function or smth
const closedSet = []
let canvas, grid, start, end

class Spot {
  constructor(x, y) {
    // Location
    this.x = x
    this.y = y

    // Distance
    this.f = 0
    this.g = 0
    this.h = 0

    this.neighbors = []

    this.show = function(color) {
      // Print spot
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color
      ctx.strokeStyle = 'rgb(0, 0, 0)'
      ctx.lineWidth = 1
      ctx.strokeRect(this.x * SPOT_SIZE, this.y * SPOT_SIZE, SPOT_SIZE, SPOT_SIZE)
      ctx.fillRect(this.x * SPOT_SIZE, this.y * SPOT_SIZE, SPOT_SIZE - 1, SPOT_SIZE - 1)
    }

    this.setNeighbors = function() {
      // Left neighbor
      if (this.x > 0) this.neighbors.push(grid[this.x - 1][this.y])
      // Top neighbor
      if (this.y > 0) this.neighbors.push(grid[this.x][this.y - 1])
      // Right neighbor
      if (this.x < GRID_COLS - 1) this.neighbors.push(grid[this.x + 1][this.y])
      // Bottom neighbor
      if (this.y < GRID_ROWS - 1) this.neighbors.push(grid[this.x][this.y + 1])
    }
  }
}

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

  // Add neighbors
  for (let i = 0; i < GRID_COLS; i++) {
    for (let j = 0; j < GRID_ROWS; j++) {
      grid[i][j].setNeighbors()
      // console.log(grid[i][j].neighbors)
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

    let lowestF = 0
    // Evaluate every spot in the open set
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestF].f) {
        lowestF = i
      }
    }

    let current = openSet[lowestF]

    if (current === end) {
      console.log('DONE!')
    }

    // Remove current spot from the open set and add it to the closed set
    openSet = openSet.filter(el => !(el.x === current.x && el.y === current.y))
    closedSet.push(current)

    for (let i = 0; i < current.neighbors.length; i++) {
      // Check every neighbor
      let tentativeG
      const neighbor = current.neighbors[i]
      if (!closedSet.includes(neighbor)) {
        tentativeG = current.g + 1 // TODO 1 being the distance between current and the neighbor

        if (openSet.includes(neighbor)) {
          if (tentativeG < neighbor.g) {
            neighbor.g = tentativeG
          }
        } else {
          neighbor.g = tentativeG
          openSet.push(neighbor)
        }
      }
    }
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

// setup()
// setInterval(loop, 1000);

// OPEN SET: nodes that NEED to be evaluated
// CLOSED SET: nodes that HAVE BEEN evaluated

// When to finish the process:
// 1. The destination node has been found (arrived)
// 2. The open set is empty, and the first point is not completed
// (That means there's no solution)
