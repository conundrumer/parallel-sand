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

import reducers from './reducers')
import App from './components/App')

let render = (store, rootElement) => {
  React.render(
    <Provider store={store}>
      {() => <App />}
    </Provider>,
    rootElement
  )
}

let enhanceStore = applyMiddleware(thunk)
const reducer = combineReducers(reducers)
const createAppStore = enhanceStore(createStore)

render(createAppStore(reducer), document.getElementById('content'))
