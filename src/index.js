import assign from 'lodash/object/assign'
import mapValues from 'lodash/object/mapValues'

import ParticleMesh from './meshes/ParticleMesh'
import ParticleDisplayShader from './shaders/ParticleDisplayShader'
import ParticlePositionShader from './shaders/ParticlePositionShader'
import ParticleVelocityShader from './shaders/ParticleVelocityShader'

import SimulationTexture from './textures/PingPongTexture'
import PingPongTexture from './textures/PingPongTexture'

import forces from './forces'

var gl = GL.create()

const simulationSize = 512

const mesh = new ParticleMesh(simulationSize)

// Shaders
const displayShader = new ParticleDisplayShader()
const positionShader = new ParticlePositionShader()
const velocityShader = new ParticleVelocityShader()

const forceShaders = mapValues(forces, (force, key) => {
  return new force.shader()
})

// Textures
const positionTexture = new PingPongTexture(gl, simulationSize)
const velocityTexture = new PingPongTexture(gl, simulationSize)

const forceTextures = mapValues(forces, (force, key) => {
  return new SimulationTexture(gl, simulationSize)
})

function clear() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

let init = true

gl.ondraw = function() {
  const forceUniforms = {
    drop: {
      dropPosition: [Math.random(), Math.random()]
    }
  }

  // Simulate
  Object.keys(forces).forEach(key => {
    forceTextures[key].drawTo(() => {
      const shader = forceShaders[key]

      positionTexture.bind(2)

      shader.uniforms(assign({
        positionSampler: 2,
      }, forceUniforms[key]))

      shader.draw(mesh, gl.POINTS)
    })
  })

  // Velocity simulation
  velocityTexture.drawTo(alternate => {
    clear()

    alternate.bind(1)
    positionTexture.bind(2)

    const forceUniforms = {}

    Object.keys(forces).forEach((key, i) => {
      const textureIndex = 3 + i

      forceUniforms[key + 'ForceSampler'] = textureIndex
      forceTextures[key].bind(textureIndex)
    })

    velocityShader.uniforms(assign({
      velocitySampler: 1,
      positionSampler: 2,
      mouseForceSampler: 3,
      init: init
    }, forceUniforms))

    velocityShader.draw(mesh, gl.POINTS)
  })

  // Position simulation
  positionTexture.drawTo(alternate => {
    clear()

    alternate.bind(1)
    velocityTexture.bind(2)

    positionShader.uniforms({
      positionSampler: 1,
      velocitySampler: 2,
      init: init
    })

    positionShader.draw(mesh, gl.POINTS)
  })

  // Display
  clear()

  positionTexture.bind(0)
  velocityTexture.bind(1)

  displayShader.uniforms({
    positionSampler: 0,
    velocitySampler: 1
  })

  displayShader.draw(mesh, gl.POINTS)

  init = false
}

window.addEventListener('load', () => {
  gl.fullscreen()
  gl.animate()
})
