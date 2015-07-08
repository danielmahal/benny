import React from 'react'

import Layer from './core/Layer'

export default class Points extends Layer {
  draw(context) {
    this.props.points.forEach(point => {
      context.fillRect(point.x, point.y, 3, 3)
    })
  }
}
