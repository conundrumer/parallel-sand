// rule(prevGrid, cell, i, j)

function setMoved (cell, moved) {
  if (moved) {
    return cell | 0x80000000
  } else {
    return cell & 0x7FFFFFFF
  }
}

function hasMoved (cell) {
  return cell & 0x80000000
}

function getDensity (cell) {
  return cell & 0xFF
}

function getCellAt (grid, i, j) {
  let h = grid.length
  let w = grid[0].length
  if (j >= 0 && j < w && i >= 0 && i < h) {
    return grid[i][j]
  } else {
    return 0xFF
  }
}

export function resetMetaData (grid, cell) {
  return setMoved(cell, false)
}

export function gravity (d) {
  return (grid, cell, i, j) => {
    let top = getCellAt(grid, i - 1, j)
    let bottom = getCellAt(grid, i + 1, j)
    if (hasMoved(cell)) {
      return cell
    }
    if (getDensity(cell) === d && getDensity(bottom) < getDensity(cell) && !hasMoved(bottom)){
      return setMoved(bottom, true)
    }
    if (getDensity(top) === d && getDensity(cell) < getDensity(top) && getDensity(top) !== 255 && !hasMoved(top)) {
      return setMoved(top, true)
    }
    return cell
  }
}

function shouldDiagonalSwap (d, center, bottom, bl) {
  return (getDensity(center) === d && !hasMoved(center)) &&
    (getDensity(bottom) >= getDensity(center)) &&
    (!hasMoved(bl) && getDensity(bl) !== 255 && getDensity(center) > getDensity(bl))
}

function shouldThreeWaySwap (d, center, bottom, bl, cl) {
  return (getDensity(center) === d && !hasMoved(center)) &&
    (getDensity(bottom) >= getDensity(center)) &&
    (!hasMoved(bl) && getDensity(bl) !== 255 && getDensity(center) > getDensity(bl)) &&
    (!hasMoved(cl) && getDensity(cl) !== 255 && getDensity(bl) > getDensity(cl))
}

export function slideDisplace (d, right = false) {
  return (grid, cell, i, j) => {
    if (hasMoved(cell)) {
      return cell
    }
    let dir = right ? -1 : 1
    let top = getCellAt(grid, i - 1, j)
    let bottom = getCellAt(grid, i + 1, j)
    // let topLeft = getCellAt(grid, i - 1, j - dir)
    let middleLeft = getCellAt(grid, i, j - dir)
    let bottomLeft = getCellAt(grid, i + 1, j - dir)
    let topRight = getCellAt(grid, i - 1, j + dir)
    let middleRight = getCellAt(grid, i, j + dir)
    let bottomRight = getCellAt(grid, i + 1, j + dir)
    if (shouldThreeWaySwap(d, cell, bottom, bottomLeft, middleLeft)) {
      return setMoved(middleLeft, true)
    }
    if (shouldThreeWaySwap(d, middleRight, bottomRight, bottom, cell)) {
      return setMoved(bottom, true)
    }
    if (shouldThreeWaySwap(d, topRight, middleRight, cell, top)) {
      return setMoved(topRight, true)
    }
    return cell
  }
}

export function slide (d, right = false) {
  return (grid, cell, i, j) => {
    if (hasMoved(cell)) {
      return cell
    }
    let dir = right ? -1 : 1
    // let top = getCellAt(grid, i - 1, j)
    let bottom = getCellAt(grid, i + 1, j)
    // let topLeft = getCellAt(grid, i - 1, j - dir)
    // let middleLeft = getCellAt(grid, i, j - dir)
    let bottomLeft = getCellAt(grid, i + 1, j - dir)
    let topRight = getCellAt(grid, i - 1, j + dir)
    let middleRight = getCellAt(grid, i, j + dir)
    // let bottomRight = getCellAt(grid, i + 1, j + dir)
    if (shouldDiagonalSwap(d, cell, bottom, bottomLeft)) {
      return setMoved(bottomLeft, true)
    }
    if (shouldDiagonalSwap(d, topRight, middleRight, cell)) {
      return setMoved(topRight, true)
    }
    return cell
  }
}
