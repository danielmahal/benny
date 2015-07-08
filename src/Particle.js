import Vector from './Vector'

export default function Particle(params = {}) {
  const {
    position = new Vector(0, 0),
    velocity = new Vector(0, 0),
    acceleration = new Vector(0, 0)
  } = params

  this.position = position
  this.velocity = velocity
  this.acceleration = acceleration
}

Particle.prototype.applyForce = function(force) {
  this.acceleration = this.acceleration.add(force)
}

Particle.prototype.integrate = function() {
  this.velocity = this.velocity.add(this.acceleration)
  this.position = this.position.add(this.velocity)
  this.acceleration = new Vector()
}
