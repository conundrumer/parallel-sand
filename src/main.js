'use strict'
// var injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();
import 'normalize.css'

// require('assets/fonts.css');
// require('./styles/main.less');

import React from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'

import * as reducers from './reducers'
import App from './components/App'

import _ from 'lodash'
let tempData = _.range(64).map(y =>
  _.range(64).map(x =>
    Math.random() > 0.5 ? 1 : 0
  )
)

let render = (store, rootElement) => {
  React.render(
    <Provider store={store}>
      {() => <App width={64} height={64} grid={tempData} />}
    </Provider>,
    rootElement
  )
}

let enhanceStore = applyMiddleware(thunk)
const reducer = combineReducers(reducers)
const createAppStore = enhanceStore(createStore)

render(createAppStore(reducer), document.getElementById('content'))
