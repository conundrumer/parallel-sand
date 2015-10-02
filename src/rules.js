// rule(prevGrid, cell, i, j)

const MAX_DENSITY = 0x7F

function setMoved (cell, moved, h, v) {
  if (moved) {
    return (cell & 0xFFFFF0FF) | 0x80000000 | (h << 8) | (v << 10)
  } else {
    return cell & 0x7FFFFFFF
  }
}

function canMove (cell) {
  return !(cell & 0x80000000)
}

function getDensity (cell) {
  return cell & MAX_DENSITY
}

function getCellAt (grid, i, j) {
  let h = grid.length
  let w = grid[0].length
  if (j >= 0 && j < w && i >= 0 && i < h) {
    return grid[i][j]
  } else {
    return 0x8000007F
  }
}

export function resetMetaData (grid, cell) {
  return getDensity(cell) !== MAX_DENSITY ?
    setMoved(cell, false) :
    cell | 0x80000000
}

function perm (tl, tr, bl, br) {
  return tl << 6 | tr << 4 | bl << 2 | br
}

const
  TL = 0b00,
  TR = 0b01,
  BL = 0b10,
  BR = 0b11

function swap(a, b) {
  let p = [TL, TR, BL, BR];
  [p[b], p[a]] = [p[a], p[b]]
  return perm(...p)
}

const
  NO_MOVE = perm(
    TL, TR,
    BL, BR
  ),
  SWAP_LEFT = swap(TL, BL),
  SWAP_RIGHT = swap(TR, BR),
  SWAP_TOP = swap(TL, TR),
  // SWAP_BOTTOM = swap(BL, BR),
  SWAP_DIAG_TL = swap(TL, BR),
  SWAP_DIAG_TR = swap(TR, BL),
  SWAP_VERT = perm(
    BL, BR,
    TL, TR
  ),
  // SWAP_HORZ = perm(
  //   TR, TL,
  //   BR, BL
  // ),
  ROTATE_TL_RIGHT = perm(
    BL, TL,
    TR, BR
  ),
  ROTATE_TR_LEFT = perm(
    TR, BR,
    BL, TL
  ),
  ROTATE_BL_RIGHT = perm(
    BR, TR,
    TL, BL
  ),
  ROTATE_BR_LEFT = perm(
    TL, BL,
    BR, TR
  )

export function cellBlock (bias, rules) {
  return (grid, cell, i, j) => {
    let parity = (i & 1) << 1 | j & 1
    let corner = bias ^ parity
    let di = corner >> 1 & 1
    let dj = corner & 1
    let tl = getCellAt(grid, i - di, j - dj)
    let tr = getCellAt(grid, i - di, j - dj + 1)
    let bl = getCellAt(grid, i - di + 1, j - dj)
    let br = getCellAt(grid, i - di + 1, j - dj + 1)

    let permutate = NO_MOVE
    for (let n = 0; n < rules.length; n++) {
      let rule = rules[n]
      permutate = rule(tl, tr, bl, br)
      if (permutate !== NO_MOVE) {
        break
      }
    }
    let nextCorner = permutate >> ((3 - corner) << 1) & 0b11
    if (corner === nextCorner) {
      return cell
    }
    let changed = corner ^ nextCorner
    let hChanged = changed & 0b01
    let vChanged = changed & 0b10
    switch (nextCorner) {
      case TL: return setMoved(tl, true, hChanged ? 0b11 : 0, vChanged ? 0b11 : 0)
      case TR: return setMoved(tr, true, hChanged ? 0b10 : 0, vChanged ? 0b11 : 0)
      case BL: return setMoved(bl, true, hChanged ? 0b11 : 0, vChanged ? 0b10 : 0)
      case BR: return setMoved(br, true, hChanged ? 0b10 : 0, vChanged ? 0b10 : 0)
    }
  }
}

export function setUnmovedCells (grid, cell) {
  return canMove(cell) ? setMoved(setMoved(cell, true, 0, 0), false) : cell
}

function shouldGravitySwap (bottom, top) {
  return canMove(bottom) && canMove(top) && getDensity(bottom) < getDensity(top)
}

export function gravityDown (tl, tr, bl, br) {
  switch (shouldGravitySwap(bl, tl) << 1 | shouldGravitySwap(br, tr)) {
    case 0b00: return NO_MOVE
    case 0b01: return SWAP_RIGHT
    case 0b10: return SWAP_LEFT
    case 0b11: return SWAP_VERT
  }
}

const
  NO_SLIDE = 0,
  SWAP_SLIDE = 1,
  ROTATE_SLIDE = 2

function trSlide (tl, tr, bl, br) {
  if (canMove(tr) && canMove(bl) && canMove(tl) &&
    (!canMove(br) || getDensity(br) >= getDensity(tr)) && getDensity(tr) > getDensity(bl)
  ) {
    if (getDensity(tl) < getDensity(bl)) {
      return ROTATE_SLIDE
    }
    if (getDensity(tl) !== getDensity(tr)) {
      return SWAP_SLIDE
    }
  }
  return NO_SLIDE
}

export function gravityDiag (tl, tr, bl, br) {
  let slideType
  slideType = trSlide(
    tl, tr,
    bl, br
  )
  switch (slideType) {
    case ROTATE_SLIDE: return ROTATE_TL_RIGHT
    case SWAP_SLIDE: return SWAP_DIAG_TR
  }
  slideType = trSlide(
    tr, tl,
    br, bl
  )
  switch (slideType) {
    case ROTATE_SLIDE: return ROTATE_TR_LEFT
    case SWAP_SLIDE: return SWAP_DIAG_TL
  }
  tl ^= MAX_DENSITY
  tr ^= MAX_DENSITY
  bl ^= MAX_DENSITY
  br ^= MAX_DENSITY
  slideType = trSlide(
    bl, br,
    tl, tr
  )
  switch (slideType) {
    case ROTATE_SLIDE: return ROTATE_BL_RIGHT
    case SWAP_SLIDE: return SWAP_DIAG_TL
  }
  slideType = trSlide(
    br, bl,
    tr, tl
  )
  switch (slideType) {
    case ROTATE_SLIDE: return ROTATE_BR_LEFT
    case SWAP_SLIDE: return SWAP_DIAG_TR
  }
  return NO_MOVE
}

function isLiquid (cell) {
  return cell & 0x80
}

function isMovingLeft (cell) {
  return (cell & 0x200) && !(cell & 0x100)
}
function isMovingRight (cell) {
  return (cell & 0x200) && (cell & 0x100)
}

function shouldLiquidSlideRight (tl, tr, br, flipped) {
  return getDensity(tl) > getDensity(tr) && isLiquid(tl) &&
    (flipped ? !isMovingRight(tl) : !isMovingLeft(tl))
}

export function liquidSlide (tl, tr, bl, br) {
  if (canMove(tr) && canMove(tl) && (
    shouldLiquidSlideRight(tl, tr, br, false) ||
    shouldLiquidSlideRight(tr, tl, bl, true)
  )) {
    return SWAP_TOP
  }
  return NO_MOVE
}

function shouldCarrySlideRight (tl, tr, br, flipped) {
  return getDensity(tl) > getDensity(tr) &&
    getDensity(br) > getDensity(tl) &&
    (flipped ? isMovingLeft(br) : isMovingRight(br))
}

export function carrySlide (tl, tr, bl, br) {
  if (canMove(tr) && canMove(tl) && (
    shouldCarrySlideRight(tl, tr, br, false) ||
    shouldCarrySlideRight(tr, tl, bl, true)
  )) {
    return SWAP_TOP
  }
  return NO_MOVE
}
