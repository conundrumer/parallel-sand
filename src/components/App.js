import React from 'react'

import '../styles.less'

function getCellColor (cell) {
  let density = cell.density
  return [
    (() => {
      switch (density) {
        case 1: return 127
        case 2: /* falls through */
        case 3: return 255
        default: return 0
      }
    })(),
    (() => {
      switch (density) {
        case 1: return 0
        case 2: return 127
        case 3: return 255
        default: return 0
      }
    })(),
    0,
    255
  ]
}

export default class App extends React.Component {

  componentDidMount () {

    setInterval(() => this.props.dispatch({
      type: 'STEP'
    }), 50)

    this.canvas = React.findDOMNode(this.refs.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.componentDidUpdate()
  }

  componentDidUpdate (prevProps = {cam: {}}) {
    let {width, height, grid} = this.props
    let imageData = this.ctx.createImageData(width, height)

    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        let index = (x + y * imageData.width) * 4
        let [r, g, b, a] = getCellColor(cell)
        imageData.data[index + 0] = r
        imageData.data[index + 1] = g
        imageData.data[index + 2] = b
        imageData.data[index + 3] = a
      })
    })
    this.ctx.putImageData(imageData, 0, 0)
  }

  render () {
    let {width, height} = this.props
    return (
      <canvas {...{width, height}} style={{position: 'absolute', width: '100%', height: '100%'}} ref='canvas' />
    )
  }

}
