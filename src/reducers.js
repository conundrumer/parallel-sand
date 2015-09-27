import _ from 'lodash'
import * as ActionTypes from './actions'

const N = 64

// import
function makeRandomGrid () {
  return _.range(N).map(y =>
    _.range(N).map(x => ({
      density: 	Math.random() < 1/4 ? 3 : 
      					Math.random() < 1/3 ? 2 : 
      					Math.random() < 1/2 ? 1 : 0
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
      inRange(j + x, i + y) ? grid[i + y][j + x] : { density: 255 }
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

import {swap1, swap2, swap3} from './rules'

export function data (state = INIT.data, action) {
  switch (action.type) {
    case ActionTypes.STEP:
      return {...state,
        grid: step(state.grid, [swap1, swap2, swap3])
      }
    default:
      return state
  }
}
