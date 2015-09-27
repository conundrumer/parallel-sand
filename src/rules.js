export function resetMetaData ([,[,center,],]) {
  return {...center, moved: false}
}

export function gravity (d) {
  return ([[,top,],[,center,],[,bottom,]]) => {
    if (center.moved) {
      return center
    }
    if (center.density === d && bottom.density < center.density && !bottom.moved){
      return {...bottom, moved: true}
    }
    if (top.density === d && center.density < top.density && top.density !== 255 && !top.moved) {
      return {...top, moved: true}
    }
    return center
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
  return ([
    [tl, top, tr],
    [cl, center, cr],
    [bl, bottom, br]
  ]) => {
    if (center.moved) {
      return center
    }
    if (right) {
      [tl, tr] = [tr, tl];
      [cl, cr] = [cr, cl];
      [bl, br] = [br, bl]
    }
    if (shouldThreeWaySwap(d, center, bottom, bl, cl)) {
      return {...cl, moved: true}
    }
    if (shouldThreeWaySwap(d, cr, br, bottom, center)) {
      return {...bottom, moved: true}
    }
    if (shouldThreeWaySwap(d, tr, cr, center, top)) {
      return {...tr, moved: true}
    }
    return center
  }
}

export function slide (d, right = false) {
  return ([
    [tl, top, tr],
    [cl, center, cr],
    [bl, bottom, br]
  ]) => {
    if (center.moved) {
      return center
    }
    if (right) {
      [tl, tr] = [tr, tl];
      [cl, cr] = [cr, cl];
      [bl, br] = [br, bl]
    }
    if (shouldDiagonalSwap(d, center, bottom, bl)) {
      return {...bl, moved: true}
    }
    if (shouldDiagonalSwap(d, tr, cr, center)) {
      return {...tr, moved: true}
    }
    return center
  }
}
