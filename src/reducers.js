import _ from 'lodash'
import * as ActionTypes from './actions'

const N = 64

function map2 (arrays, fn) {
  return _.map(arrays, (array, i) =>
    _.map(array, (x, j) =>
      fn(x, i, j)
    )
  )
}

// import
function makeRandomGrid () {
  return _.range(N).map(y =>
    _.range(N).map(x => ({
      density:
        Math.random() < 1 / 4 ? 3 :
        Math.random() < 1 / 3 ? 2 :
        Math.random() < 1 / 2 ? 1 : 0
    }))
  )
}

function getLocalGrid (grid, ci, cj) {
  let h = grid.length
  let w = grid[0].length
  let localGrid = []
  for (let di = -1; di <= 1; di++) {
    let i = ci + di
    let row = []
    for (let dj = -1; dj <= 1; dj++) {
      let j = cj + dj
      if (j >= 0 && j < w && i >= 0 && i < h) {
        row.push(grid[i][j])
      } else {
        row.push({ density: 255 })
      }
    }
    localGrid.push(row)
  }
  return localGrid
}

function ensureConservationOfMass (grid, nextGrid) {
  let [counts, nextCounts] = _.map([grid, nextGrid], g =>
    _.mapValues(_.groupBy(_.flatten(g), 'density'), dGroup => dGroup.length)
  )
  return _.eq(counts, nextCounts)
}

// function stepDebug (grid, rules) {
//   let g = _.reduce(rules, (prevGrid, rule) => {
//     let x = map2(prevGrid, (cell, i, j) => {
//       let g = getLocalGrid(prevGrid, i, j)
//       return rule(g)
//     })
//     // console.table(map2(x, cell => cell.density))
//     return x
//   }, grid)
//   if (!ensureConservationOfMass(grid, g)) {
//     console.error('mass not conserved:')
//     alert('mass not conserved')
//     console.table(map2(grid, cell => cell.density))
//     console.table(map2(g, cell => cell.density))
//   }
//   return g
// }

function step (grid, rules) {
  return _.reduce(rules, (prevGrid, rule) =>
    map2(prevGrid, (cell, i, j) => {
      let g = getLocalGrid(prevGrid, i, j)
      return rule(g)
    })
  , grid)
}

const INIT = {
  data: {
    width: N,
    height: N,
    grid: makeRandomGrid()
  }
}

import {resetMetaData, gravity, slideDisplace, slide} from './rules'
const rules = [
  resetMetaData,
  gravity(1),
  slideDisplace(1),
  slideDisplace(1, true),
  slide(1),
  slide(1, true),
  gravity(2),
  slideDisplace(2),
  slideDisplace(2, true),
  slide(2),
  slide(2, true),
  gravity(3),
  slideDisplace(3),
  slideDisplace(3, true),
  slide(3),
  slide(3, true)
]

export function data (state = INIT.data, action) {
  switch (action.type) {
    case ActionTypes.STEP:
      return {...state,
        grid: step(state.grid, rules)
      }
    default:
      return state
  }
}
