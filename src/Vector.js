export default function Vector(x = 0, y = 0) {
  this.x = x
  this.y = y
}

Vector.prototype.clone = function() {
  return new Vector(this.x, this.y)
}

Vector.prototype.add = function(v) {
  return new Vector(this.x + v.x, this.y + v.y)
}

Vector.prototype.subtract = function(v) {
  return new Vector(this.x - v.x, this.y - v.y)
}

Vector.prototype.divideScalar = function(s) {
  return new Vector(this.x / s, this.y / s)
}

Vector.prototype.multiplyScalar = function(s) {
  return new Vector(this.x * s, this.y * s)
}

Vector.prototype.dot = function(v) {
  return this.x * v.x + this.y * v.y
}

Vector.prototype.length = function(v) {
  return Math.sqrt(this.dot(this))
}
