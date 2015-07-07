import React from 'react'

import createCanvasContainer from './createCanvasContainer'

class SomeComponent extends React.Component {
  constructor(props) {
    super(props)

    this.componentDidMount = this.renderCanvas
    this.componentDidUpdate = this.renderCanvas
  }

  renderCanvas() {
    const {canvas, canvasContext} = this.props

    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    canvasContext.fillStyle = `rgba(0, 0, 0, ${Math.sin(this.props.seconds)})`
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    this.props.render()
  }

  render() {
    return null
  }
}

export default createCanvasContainer(SomeComponent)
