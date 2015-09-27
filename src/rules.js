export function resetMetaData ([,[,center,],]) {
  return {
    ...center,
    moved: false
  }
}

export function gravity (d) {
  return ([[,top,],[,center,],[,bottom,]]) => {
    if (center.moved === true) {
      return center
    }
    if (center.density === d && bottom.density < center.density && bottom.moved === false){
      return {
        ...bottom,
        moved: true
      }
    }
    if (top.density === d && center.density < top.density && top.density !== 255 && top.moved === false) {
      return {
        ...top,
        moved: true
      }
    }
    return center
  }
}

