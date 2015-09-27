import React from 'react'

function getCellColor (cell) {
  let type = cell.type
  return [
    type > 0 ? 255 : 0,
    type > 0 ? 255 : 0,
    0,
    255
  ]
}

export default class App extends React.Component {

  componentDidMount () {

    setInterval(() => this.props.dispatch({
      type: 'STEP'
    }), 100)

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
