import {Vector2} from 'three'

export default function Particle(params = {}) {
  const {
    position = new Vector2(),
    velocity = new Vector2(),
    acceleration = new Vector2()
  } = params

  this.previousPosition = new Vector2()
  this.position = position
  this.velocity = velocity
  this.acceleration = acceleration
}

Particle.prototype.applyForce = function(force) {
  this.acceleration.add(force)
}

Particle.prototype.integrate = function() {
  this.previousPosition = this.position.clone()
  this.velocity.add(this.acceleration)
  this.position.add(this.velocity)
  this.acceleration.set(0, 0)
}
