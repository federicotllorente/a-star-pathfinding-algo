const GRID_COLS = 50
const GRID_ROWS = 50

const SPOT_SIZE = window.innerHeight < window.innerWidth
  ? (window.innerHeight - 16) / GRID_ROWS
  : (window.innerWidth - 16) / GRID_COLS

const LOOP_INTERVAL = 50
const WALL_PROBABILITY = 0.2

let openSet = [] // TODO Don't use let, use const, but I need a removeFromArray function or smth
const closedSet = []
let path = []
let int, canvas, grid, start, end
let isFinished = false

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
    this.previous = null
    this.isWall = false

    if (Math.random() < WALL_PROBABILITY) {
      this.isWall = true
    }

    this.show = function(color) {
      // Print spot
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = this.isWall ? 'rgb(0, 0, 0)' : color
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

      // Diagonals

      // Top left
      if (this.x > 0 && this.y > 0)
        this.neighbors.push(grid[this.x - 1][this.y - 1])

      // Top right
      if (this.x < GRID_COLS - 1 && this.y > 0)
        this.neighbors.push(grid[this.x + 1][this.y - 1])

      // Bottom left
      if (this.x > 0 && this.y < GRID_ROWS - 1)
        this.neighbors.push(grid[this.x - 1][this.y + 1])

      // Bottom right
      if (this.x < GRID_COLS - 1 && this.y < GRID_ROWS - 1)
        this.neighbors.push(grid[this.x + 1][this.y + 1])
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
    }
  }

  // Set start and end
  start = grid[0][0]
  end = grid[GRID_COLS - 1][GRID_ROWS - 1]

  // Init open set
  openSet.push(start)
}

function distBetween(a, b) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
  // return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function removeFromArray(arr, el) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == el) {
      arr.splice(i, 1)
    }
  }
}

function loop() {
  let current

  if (openSet.length > 0) {
    // Keep going

    let lowestF = 0
    // Evaluate every spot in the open set
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestF].f) {
        lowestF = i
      }
    }

    current = openSet[lowestF]

    if (current === end) {
      console.log('DONE!')
      clearInterval(int)
      isFinished = true
    }

    // Remove current spot from the open set and add it to the closed set
    removeFromArray(openSet, current)
    closedSet.push(current)

    for (let i = 0; i < current.neighbors.length; i++) {
      // Check every neighbor
      const neighbor = current.neighbors[i]
      if (!closedSet.includes(neighbor) && !neighbor.isWall) {
        // Distance from start to neighbor
        let tentativeG = current.g + 1 // TODO 1 being the distance between current and the neighbor
        let isNewPath = false

        if (openSet.includes(neighbor)) {
          if (tentativeG < neighbor.g) {
            neighbor.g = tentativeG
            isNewPath = true
          }
        } else {
          neighbor.g = tentativeG
          isNewPath = true
          openSet.push(neighbor)
        }

        if (isNewPath) {
          neighbor.h = distBetween(neighbor, end) // Distance between the neighbor and the end (heuristic cost estimate?)
          neighbor.f = neighbor.g + neighbor.h
          neighbor.previous = current
        }
      }
    }
  } else {
    // No solution
    console.log('NO SOLUTION :(')
    clearInterval(int)
    isFinished = true
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

  // Find the path
  path = []
  let temp = current
  path.push(current)
  while (temp?.previous) {
    path.push(temp.previous)
    temp = temp.previous
  }

  // Print in blue spots in the path
  for (let i = 0; i < path.length; i++) {
    path[i]?.show('rgb(0, 0, 255)')
  }

  // TODO
  start.isWall = false
  end.isWall = false
}

setup()
int = setInterval(loop, LOOP_INTERVAL)

let isPaused = false

// Start/pause/resume searching when the spacebar is tapped
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    if (isFinished) {
      location.reload()
    } else {
      if (!isPaused) {
        clearInterval(int)
        console.log('PAUSED')
        isPaused = true
      } else {
        int = setInterval(loop, LOOP_INTERVAL)
        console.log('RESUMED')
        isPaused = false
      }
    }
  }
})

// OPEN SET: nodes that NEED to be evaluated
// CLOSED SET: nodes that HAVE BEEN evaluated

// When to finish the process:
// 1. The destination node has been found (arrived)
// 2. The open set is empty, and the first point is not completed
// (That means there's no solution)
