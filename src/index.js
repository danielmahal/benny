import React from 'react'

import createCanvasContainer from './createCanvasContainer'
import SomeComponent from './SomeComponent'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.tick = this.tick.bind(this)

    this.state = {
      time: 0
    }
  }

  requestTick() {
    requestAnimationFrame(this.tick)
  }

  tick(time) {
    this.setState({
      seconds: time / 1000
    })

    this.requestTick()
  }

  renderChild(canvas) {
    if(this.canvasContext) {
      this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.canvasContext.drawImage(canvas, 0, 0)
    }
  }

  componentDidMount() {
    this.canvas = React.findDOMNode(this.refs.canvas)
    this.canvasContext = this.canvas.getContext('2d')

    this.forceUpdate()
    this.requestTick()
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div>
        <canvas ref="canvas" />
        <SomeComponent render={this.renderChild.bind(this)} />
      </div>
    )
  }
}

window.addEventListener('load', () => {
  React.render(<Application />, document.body)
})
