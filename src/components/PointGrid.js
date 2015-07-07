import React from 'react'

import Layer from './core/Layer'

export default class PointGrid extends Layer {
  draw(context) {
    const {width, height} = context.canvas
    for(var x = this.props.size; x < width; x += this.props.size) {
      for(var y = this.props.size; y < height; y += this.props.size) {
        context.fillRect(x, y, this.props.pointSize, this.props.pointSize)
      }
    }
  }
}
