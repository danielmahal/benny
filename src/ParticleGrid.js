import Grid from './Grid'
import Particle from './Particle'
import {Vector2} from 'three'

export default function ParticleGrid(params) {
  const grid = new Grid(params)

  this.onUpdate = params.onUpdate

  this.forces = []

  // Create particles
  this.particles = grid.points.map(point => {
    const particle = new Particle({
      position: point.clone()
    })

    particle.origin = particle.position.clone()

    return particle
  })
}

ParticleGrid.prototype.update = function() {
  // Apply forces
  this.forces.forEach(force => {
    this.particles.forEach(particle => particle.applyForce(force(particle) || new Vector2()))
  })

  // Integrate
  this.particles.forEach(particle => particle.integrate())

  this.onUpdate && this.onUpdate()
}
