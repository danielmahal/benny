import Grid from './Grid'
import Particle from './Particle'
import Vector from './Vector'

var mouse = new Vector(window.innerWidth / 2, window.innerHeight / 2)

window.addEventListener('mousemove', function(e) {
  mouse.x = e.clientX * devicePixelRatio
  mouse.y = e.clientY * devicePixelRatio
})

function mouseAttraction(particle) {
  const distance = mouse.subtract(particle.position).length()
  const effect = distance / Math.pow(distance, 2)

  return mouse.subtract(particle.position).multiplyScalar(effect)
}

function gravity() {
  return new Vector(0, 0.5)
}

function friction(particle) {
  return particle.velocity.multiplyScalar(-0.01)
}

function origin(particle) {
  return particle.origin.subtract(particle.position).divideScalar(40)
}

export default function ParticleGrid(params) {
  const grid = new Grid(params)

  this.onUpdate = params.onUpdate

  this.forces = [
    mouseAttraction,
    origin,
    friction
  ]

  // Create particles
  this.particles = grid.points.map(point => {
    const particle = new Particle({
      position: point.clone()
    })

    particle.origin = particle.position.clone()

    return particle
  })

  this.update = this.update.bind(this)

  this.requestUpdate()
}

ParticleGrid.prototype.requestUpdate = function() {
  requestAnimationFrame(this.update)
}

ParticleGrid.prototype.update = function() {
  this.requestUpdate()

  this.forces.forEach(force => {
    this.particles.forEach(particle => particle.applyForce(force(particle)))
  })

  this.particles.forEach(particle => particle.integrate())

  this.onUpdate && this.onUpdate()
}
