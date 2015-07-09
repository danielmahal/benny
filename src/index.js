import React from 'react'
import {Vector2} from 'three'

import Controls from './components/core/Controls'
import Layer from './components/core/Layer'

import ParticleGrid from './ParticleGrid'
import VectorField from './VectorField'
import Invert from './components/Invert'
import Lines from './components/Lines'

const mouse = new Vector2()

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mouseDown: false
    }

    this.grid = new ParticleGrid({
      width: window.innerWidth * devicePixelRatio,
      height: window.innerHeight * devicePixelRatio,
      size: 60 * devicePixelRatio
      // ,onUpdate: this.onGridUpdate.bind(this)
    })

    this.vectorField = new VectorField({
      width: window.innerWidth * devicePixelRatio,
      height: window.innerHeight * devicePixelRatio,
      size: 40 * devicePixelRatio
    })

    const center = new Vector2(
      (window.innerWidth / 2) * devicePixelRatio,
      (window.innerHeight / 2) * devicePixelRatio
    )

    this.grid.forces = [
      // Friction
      particle => {
        return particle.velocity.clone().multiplyScalar(this.state.mouseDown ? -0.02 : -0.1)
      },

      // Origin
      particle => {
        return particle.origin.clone().sub(particle.position).divideScalar(100)
      },

      // Center
      particle => {
        return particle.position.clone().sub(center).divideScalar(-2000)
      },

      // Mouse repulsion
      particle => {
        const distance = Math.pow(mouse.distanceTo(particle.position) / 100, 6)

        if(this.state.mouseDown) {
          return particle.position.clone().sub(mouse).divideScalar(distance).multiplyScalar(20)
        }
      },

      // Vector field
      particle => {
        return this.vectorField.sample(particle.position).vector.divideScalar(-20)
      }
    ]

    this.tick = this.tick.bind(this)

    this.requestTick()

    console.log('%d particles in grid', this.grid.particles.length)
  }

  requestTick() {
    requestAnimationFrame(this.tick)
  }

  tick(time) {
    this.time = time / 1000

    this.grid.update()
    this.vectorField.noise(1000, time / 5000, time / 5000)

    this.requestTick()
    this.forceUpdate()
  }

  onGridUpdate() {
    this.forceUpdate()
  }

  onConfigChange(config) {
    this.setState(config)
  }

  onMouseDown() {
    this.setState({
      mouseDown: true
    })
  }

  onMouseUp() {
    this.setState({
      mouseDown: false
    })
  }

  onMouseMove(e) {
    mouse.x = e.clientX * devicePixelRatio
    mouse.y = e.clientY * devicePixelRatio
  }

  render() {
    // Vector field
    const vectorLines = this.vectorField.vectors.map(vector =>
      [vector.position, vector.position.clone().sub(vector.vector)]
    )

    // Particles
    const particleLines = this.grid.particles.map(particle =>
      [particle.position, particle.previousPosition]
    )

    return (
      <div onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)} onMouseMove={this.onMouseMove.bind(this)}>
        <Controls value={this.state} onChange={this.onConfigChange.bind(this)} />

        <Layer>
          <Invert>
            <Lines key="particleLines" lines={particleLines} lineWidth={5} />
          </Invert>
        </Layer>
      </div>
    )
  }
}

window.addEventListener('load', () => {
  React.render(<Application />, document.body)
})
