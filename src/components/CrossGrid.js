import React from 'react'

import Layer from './core/Layer'

export default class CrossGrid extends Layer {
  constructor(props) {
    super(props)

    this.state = {
      crosses: []
    }
  }

  snapToGrid(value) {
    return Math.round(value / this.props.size) * this.props.size
  }

  createCross() {
    const crosses = this.state.crosses.concat()

    var cross = {
      x: this.snapToGrid(Math.random() * this.canvas.width),
      y: this.snapToGrid(Math.random() * this.canvas.height),
      size: this.snapToGrid((Math.random() * this.props.size * (this.props.max - this.props.min)) + this.props.min)
    }

    crosses.push(cross)

    var lifeTime = Math.random() * 1000 + 50

    // Remove cross
    setTimeout(this.removeCross.bind(this, cross), lifeTime)

    // Create new cross
    setTimeout(this.createCross.bind(this), Math.random() * 1000 + 50)

    this.setState({
      crosses: crosses
    })
  }

  removeCross(cross) {
    const crosses = this.state.crosses.concat()

    crosses.splice(crosses.indexOf(cross), 1)

    this.setState({
      crosses: crosses
    })
  }

  componentDidMount() {
    super.componentDidMount()

    this.createCross()
  }

  draw(context) {
    const {crosses} = this.state

    crosses.forEach(function(cross) {
      context.save()
      context.translate(cross.x, cross.y)

      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo(cross.size, cross.size)
      context.stroke()

      if(Math.random() < 0.5) {
        context.beginPath()
        context.moveTo(cross.size, 0)
        context.lineTo(0, cross.size)
        context.stroke()
      }

      context.restore()
    })
  }
}
