import _ from 'lodash'
import * as ActionTypes from './actions'

const N = 64

// import
function makeRandomGrid () {
  return _.range(N).map(y =>
    _.range(N).map(x => ({
      type: Math.random() > 0.5 ? 1 : 0
    }))
  )
}

function map2 (arrays, fn) {
  return _.map(arrays, (array, i) =>
    _.map(array, (x, j) =>
      fn(x, i, j)
    )
  )
}

function getLocalGrid (grid, i, j) {
  let h = grid.length
  let w = grid[0].length
  let inRange = (x, y) => x >= 0 && x < w && y >= 0 && y < h
  return _.map(_.range(-1, 2), y =>
    _.map(_.range(-1, 2), x =>
      inRange(j + x, i + y) ? grid[i + y][j + x] : { type: 100 }
    )
  )
}

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

export function data (state = INIT.data, action) {
  switch (action.type) {
    case ActionTypes.STEP:
      return {...state,
        grid: step(state.grid, [(localGrid) => {
          let g = _.map(_.flatten(localGrid), cell => cell.type === 1 ? 1 : 0)
          let sum = _.sum(_.map([0, 1, 2, 3, 5, 6, 7, 8], i => g[i]))
          let center = g[4]
          if (center === 1) {
            if (sum < 2) {
              return {type: 0}
            }
            if (sum === 2 || sum === 3) {
              return {type: 1}
            }
            if (sum > 3) {
              return {type: 0}
            }
          } else {
            if (sum === 3) {
              return {type: 1}
            }
          }
          return localGrid[1][1]
        }])
      }
    default:
      return state
  }
}
