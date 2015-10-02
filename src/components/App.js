import React from 'react'

import '../styles.less'

function getCellColor (cell) {
  let density = cell & 0x7F
  switch (density) {
    case 1:
      return [255, 0, 0, 255]
    case 2:
      return [255, 127, 0, 255]
    case 3:
      return [255, 255, 0, 255]
    case 0x7F:
      return [127, 127, 127, 255]
    default:
      return [0, 0, 0, 255]
  }
}

export default class App extends React.Component {

  componentDidMount () {

    let update = () => {
      this.props.dispatch({
        type: 'STEP'
      })
      requestAnimationFrame(update)
    }
    update()

    // setInterval(update, 500)

    this.canvas = React.findDOMNode(this.refs.canvas)
    this.ctx = this.canvas.getContext('2d')
    this.componentDidUpdate()
  }

  componentDidUpdate (prevProps = {cam: {}}) {
    let {width, height, grid} = this.props
    let imageData = this.ctx.createImageData(width, height)

    for (let i = 0; i < grid.length; i++) {
      let row = grid[i]
      for (let j = 0; j < row.length; j++) {
        let cell = row[j]
        let index = (j + i * imageData.width) * 4
        let [r, g, b, a] = getCellColor(cell)
        imageData.data[index + 0] = r
        imageData.data[index + 1] = g
        imageData.data[index + 2] = b
        imageData.data[index + 3] = a
      }
    }
    this.ctx.putImageData(imageData, 0, 0)
  }

  render () {
    let {width, height} = this.props
    return (
      <canvas {...{width, height}} style={{position: 'absolute', width: '100%', height: '100%'}} ref='canvas' />
    )
  }

}
