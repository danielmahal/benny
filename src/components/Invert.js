import React from 'react'

import Layer from './core/Layer'

export default class Invert extends Layer {
  draw(context) {
    context.save()
    context.globalCompositeOperation = 'xor'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    context.restore()
  }
}
