import React from 'react'
import assign from 'lodash/object/assign'

import Layer from './core/Layer'

export default class Lines extends Layer {
  draw(context) {


    this.props.lines.forEach(line => {
      const length = line[0].distanceTo(line[1])

      context.lineWidth = Math.max(this.props.lineWidth - (length / 20), 0.3)
      context.beginPath()
      context.moveTo(line[0].x, line[0].y)
      context.lineTo(line[1].x, line[1].y)
      context.stroke()
    })
  }
}

Lines.defaultProps = assign({
  lineWidth: 1
}, Layer.defaultProps)
