import React from 'react'
import assign from 'lodash/object/assign'

import Layer from './core/Layer'

export default class Lines extends Layer {
  draw(context) {
    context.lineWidth = this.props.lineWidth

    this.props.lines.forEach(line => {
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
