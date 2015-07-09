import flatten from 'lodash/array/flatten'
import times from 'lodash/utility/times'

import {Vector2} from 'three'

export default function Grid(params) {
  const {width, height, size} = params

  this.width = width
  this.height = height

  this.size = size
  this.cols = Math.round(width / size)
  this.rows = Math.round(height / size)

  this.points = flatten(times(this.rows, row => {
    return times(this.cols, col => {
      return new Vector2(col * size, row * size)
    })
  }))
}
