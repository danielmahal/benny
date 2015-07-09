import Grid from './Grid'
import Particle from './Particle'
import {Vector2} from 'three'

import noise from '../libs/perlin'

export default function VectorField(params) {
  this.grid = new Grid(params)

  this.vectors = this.grid.points.map(point => {
    return {
      position: point.clone(),
      vector: new Vector2()
    }
  })

  this.noise(500, Math.random(), Math.random())
}

VectorField.prototype.noise = function(size, seed, magSeed) {
  this.vectors = this.grid.points.map(point => {
    const angle = noise.simplex3(point.x / size, point.y / size, seed) * Math.PI * 2
    const magnitude = (noise.simplex3(point.x / size, point.y / size, magSeed) + 1) * 10

    return {
      position: point.clone(),
      vector: new Vector2(Math.sin(angle) * magnitude, Math.cos(angle) * magnitude)
    }
  })
}

const empty = {
  position: new Vector2(),
  vector: new Vector2()
}

VectorField.prototype.sample = function(position) {
  const col = Math.round(position.x / this.grid.size)
  const row = Math.round(position.y / this.grid.size)

  return this.vectors[row * this.grid.cols + col] || empty
}
