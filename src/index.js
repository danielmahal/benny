import React from 'react'

import ParticleGrid from './ParticleGrid'
import Controls from './components/core/Controls'
import Layer from './components/core/Layer'

import Invert from './components/Invert'
import Points from './components/Points'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.grid = new ParticleGrid({
      width: window.innerWidth * devicePixelRatio,
      height: window.innerHeight * devicePixelRatio,
      size: 40 * devicePixelRatio,
      onUpdate: this.onGridUpdate.bind(this)
    })

    console.log('%d particles in grid', this.grid.particles.length)
  }

  onGridUpdate() {
    this.forceUpdate()
  }

  onConfigChange(config) {
    this.setState(config)
  }

  render() {
    const points = this.grid.particles.map(particle => particle.position)

    return (
      <div>
        <Controls value={this.state} onChange={this.onConfigChange.bind(this)} />

        <Layer>
          <Invert>
            <Points points={points} />
          </Invert>
        </Layer>
      </div>
    )
  }
}

window.addEventListener('load', () => {
  React.render(<Application />, document.body)
})
