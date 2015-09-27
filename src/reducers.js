import _ from 'lodash'
import * as ActionTypes from './actions'
// import
function makeRandomGrid () {
  return _.range(64).map(y =>
    _.range(64).map(x => ({
      type: Math.random() > 0.5 ? 1 : 0
    }))
  )
}

function step (grid, rules) {
  return makeRandomGrid()
}

const INIT = {
  data: {
    width: 64,
    height: 64,
    grid: makeRandomGrid()
  }
}

export function data (state = INIT.data, action) {
  switch (action.type) {
    case ActionTypes.STEP:
      return {...state,
        grid: step(state.grid)
      }
    default:
      return state
  }
}
