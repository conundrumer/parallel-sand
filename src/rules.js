// rule(prevGrid, cell, i, j)

function setMoved (cell, moved) {
  return {
    density: cell.density,
    moved
  }
}

function getCellAt (grid, i, j) {
  let h = grid.length
  let w = grid[0].length
  if (j >= 0 && j < w && i >= 0 && i < h) {
    return grid[i][j]
  } else {
    return {
      density: 255
    }
  }
}

export function resetMetaData (grid, cell) {
  return setMoved(cell, false)
}

export function gravity (d) {
  return (grid, cell, i, j) => {
    let top = getCellAt(grid, i - 1, j)
    let bottom = getCellAt(grid, i + 1, j)
    if (cell.moved) {
      return cell
    }
    if (cell.density === d && bottom.density < cell.density && !bottom.moved){
      return setMoved(bottom, true)
    }
    if (top.density === d && cell.density < top.density && top.density !== 255 && !top.moved) {
      return setMoved(top, true)
    }
    return cell
  }
}

function shouldDiagonalSwap (d, center, bottom, bl) {
  return (center.density === d && !center.moved) &&
    (bottom.density >= center.density) &&
    (!bl.moved && bl.density !== 255 && center.density > bl.density)
}

function shouldThreeWaySwap (d, center, bottom, bl, cl) {
  return (center.density === d && !center.moved) &&
    (bottom.density >= center.density) &&
    (!bl.moved && bl.density !== 255 && center.density > bl.density) &&
    (!cl.moved && cl.density !== 255 && bl.density > cl.density)
}

export function slideDisplace (d, right = false) {
  return (grid, cell, i, j) => {
    if (cell.moved) {
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
    if (cell.moved) {
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
