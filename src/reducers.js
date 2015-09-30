import _ from 'lodash'
import * as ActionTypes from './actions'

const N = 128

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
    _.range(N).map(x =>
      Math.random() < 1 / 4 ? 3 :
      Math.random() < 1 / 3 ? 2 :
      Math.random() < 1 / 2 ? 1 : 0
    )
  )
}

// function getLocalGridSlow (grid, i, j) {
//   let h = grid.length
//   let w = grid[0].length
//   let inRange = (x, y) => x >= 0 && x < w && y >= 0 && y < h
//   return _.map(_.range(-1, 2), y =>
//     _.map(_.range(-1, 2), x =>
//       inRange(j + x, i + y) ? grid[i + y][j + x] : { density: 255 }
//     )
//   )
// }

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
        row.push(0xFF)
      }
    }
    localGrid.push(row)
  }
  return localGrid
}

function ensureConservationOfMass (grid, nextGrid) {
  let [counts, nextCounts] = _.map([grid, nextGrid], g =>
    _.mapValues(_.groupBy(_.flatten(g), x => x), dGroup => dGroup.length)
  )
  return _.eq(counts, nextCounts)
}

// function stepDebug (grid, rules) {
//   // console.log('step-debug')
//   let g = _.reduce(rules, (prevGrid, rule) => {
//     let x = map2(prevGrid, (cell, i, j) => {
//       return rule(prevGrid, cell, i, j)
//     })
//     // console.table(x)
//     return x
//   }, grid)
//   if (!ensureConservationOfMass(grid, g)) {
//     console.error('mass not conserved:')
//     alert('mass not conserved')
//     console.table(grid)
//     console.table(g)
//   }
//   return g
// }

// function stepSlow (grid, rules) {
//   return _.reduce(rules, (prevGrid, rule) =>
//     map2(prevGrid, (cell, i, j) => {
//       return rule(prevGrid, cell, i, j)
//     })
//   , grid)
// }

function cloneGrid(grid) {
  return _.map(grid, row => _.map(row, cell => cell))
}

function step (grid, rules) {
  let h = grid.length
  let w = grid[0].length
  let gridA = cloneGrid(grid)
  let gridB = cloneGrid(grid)
  let prevGrid, nextGrid

  for (let n = 0; n < rules.length; n++) {
    let rule = rules[n];
    [prevGrid, nextGrid] = n % 2 === 0 ? [gridA, gridB] : [gridB, gridA]
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        nextGrid[i][j] = rule(prevGrid, prevGrid[i][j], i, j)
      }
    }
  }
  return nextGrid
}

const INIT = {
  data: {
    index: 0,
    width: N,
    height: N,
    grid: makeRandomGrid()
  }
}

import {resetMetaData, gravity, slideDisplace, slide} from './rules'
function makeBiasedRules(right = false) {
  return [
    resetMetaData,
    gravity(1),
    slideDisplace(1, !right),
    slideDisplace(1, right),
    slide(1, !right),
    slide(1, right),
    gravity(2),
    slideDisplace(2, !right),
    slideDisplace(2, right),
    slide(2, !right),
    slide(2, right),
    gravity(3),
    slideDisplace(3, !right),
    slideDisplace(3, right),
    slide(3, !right),
    slide(3, right)
  ]
}

const leftBiasedRules = makeBiasedRules()
const rightBiasedRules = makeBiasedRules(true)

export function data (state = INIT.data, action) {
  switch (action.type) {
    case ActionTypes.STEP:
      return {...state,
        index: state.index + 1,
        grid: step(state.grid, state.index % 2 === 0 ? leftBiasedRules : rightBiasedRules)
      }
    default:
      return state
  }
}
