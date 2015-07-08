import flatten from 'lodash/array/flatten'
import times from 'lodash/utility/times'

import Vector from './Vector'

export default function Grid(params) {
  const {width, height, size} = params

  this.size = size
  this.cols = width / size
  this.rows = height / size

  this.points = flatten(times(this.rows, row => {
    return times(this.cols, col => {
      return new Vector(col * size, row * size)
    })
  }))
}
