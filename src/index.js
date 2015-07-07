import React from 'react'

import Layer from './Layer'

class Controls extends React.Component {
  render() {
    const style = {
      position: 'absolute',
      top: 0,
      left: 0
    }

    return (
      <div style={style}>
        {this.props.children}
      </div>
    )
  }
}

class SquareOverlay extends Layer {
  draw(context) {
    context.save()
    context.globalCompositeOperation = 'xor'
    context.fillRect(0, 0, 100, 100)
    context.restore()
  }
}

class Circle extends Layer {
  draw(context) {
    context.fillStyle = this.props.color
    context.beginPath()
    context.arc(this.props.x, this.props.y, 50, 0, Math.PI * 2)
    context.fill()
  }
}

class CrazyCircle extends Layer {
  draw(context) {
    context.fillStyle = `hsl(${Math.sin(this.props.seconds) * 255}, 100%, 50%)`
    context.beginPath()
    context.arc(this.props.x, this.props.y, 50, 0, Math.PI * 2)
    context.fill()
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      crazyCircle: false,
      seconds: 0
    }

    this.tick = this.tick.bind(this)
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

  componentDidMount() {
    this.requestTick()
  }

  toggleCrazyCircle() {
    this.setState({
      crazyCircle: !this.state.crazyCircle
    })
  }

  render() {
    return (
      <div>
        <Controls>
          <button onClick={this.toggleCrazyCircle.bind(this)}>Toggle crazy circle</button>
        </Controls>

        <Layer>
          <SquareOverlay>
            {this.state.crazyCircle && <CrazyCircle key="crazy" x="70" y="70" seconds={this.state.seconds} />}
            <Circle key="red" x={50 +Math.sin(this.state.seconds) * 100} y="100" color="red" />
          </SquareOverlay>
        </Layer>
      </div>
    )
  }
}

window.addEventListener('load', () => {
  React.render(<Application />, document.body)
})
