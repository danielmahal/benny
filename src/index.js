import lightgl from '../libs/lightgl'

import assign from 'lodash/object/assign'
import mapValues from 'lodash/object/mapValues'

import BirdMesh from './meshes/BirdMesh'
import ParticleMesh from './meshes/ParticleMesh'
import DebugMesh from './meshes/DebugMesh'

import GeometryShader from './shaders/GeometryShader'
import ParticleDisplayShader from './shaders/ParticleDisplayShader'
import ParticlePositionShader from './shaders/ParticlePositionShader'
import ParticleVelocityShader from './shaders/ParticleVelocityShader'
import DebugShader from './shaders/SimulationDebugShader'

import SimulationTexture from './textures/PingPongTexture'
import PingPongTexture from './textures/PingPongTexture'

import midi from './midi'

import forces from './forces'

var gl = lightgl.create()

const simulationSize = 256

const cubeMesh = new lightgl.Mesh.cube().computeWireframe()
const birdMesh = new BirdMesh(simulationSize)
const particleMesh = new ParticleMesh(simulationSize)
const debugMesh = new DebugMesh()

// Shaders
const cubeShader = new lightgl.Shader('\
  void main() {\
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
  }\
', '\
  void main() {\
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\
  }\
');

const displayShader = new ParticleDisplayShader()
const positionShader = new ParticlePositionShader()
const velocityShader = new ParticleVelocityShader()
const geometryShader = new GeometryShader()
const debugShader = new DebugShader()

const forceShaders = mapValues(forces, (force, key) => {
  return new force.shader()
})

// Textures
const birdTexture = new SimulationTexture(gl, simulationSize)
const positionTexture = new PingPongTexture(gl, simulationSize)
const velocityTexture = new PingPongTexture(gl, simulationSize)

const forceTextures = mapValues(forces, (force, key) => {
  return new SimulationTexture(gl, simulationSize)
})

function clear() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

let time = 0
let init = true

let mouse = [0.5, 0.5]
let mousedown = false

window.addEventListener('mousemove', e => {
  mouse[0] = e.clientX / window.innerWidth
  mouse[1] = 1-(e.clientY / window.innerHeight)
})

window.addEventListener('mousedown', e => {
  mousedown = true
})

window.addEventListener('mouseup', e => {
  mousedown = false
})

let setup = true;

gl.onupdate = function() {
  time += 0.1
}

gl.ondraw = function() {
  gl.loadIdentity();
  gl.translate(0, 0, -2);
  gl.rotate(time * 5, 0, -1, 0);

  if(setup) {
    setup = false;

    birdTexture.drawTo(() => {
      geometryShader.draw(birdMesh, gl.POINTS)
    })
  }

  const forceUniforms = {
    // center: {
    //   dropPosition: mouse,
    //   strength: (Math.sin(time * 0.2) + 2) * 0.0005
    // },

    drop: {
      dropPosition: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
      strength: ((midi.knob[0] || 0.5) - 0.5) * (midi.knob[5] || 0)
    },

    origin: {
      strength: (midi.knob[1] || 0) * 0.1
    },

    noise: {
      size: 6,
      time: time / 100
    }
  }

  // Simulate
  Object.keys(forces).forEach(key => {
    forceTextures[key].drawTo(() => {
      const shader = forceShaders[key]

      positionTexture.bind(1)
      velocityTexture.bind(2)
      birdTexture.bind(3)

      shader.uniforms(assign({
        positionSampler: 1,
        velocitySampler: 2,
        originSampler: 3,
      }, forceUniforms[key]))

      shader.draw(particleMesh, gl.POINTS)
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

    velocityShader.draw(particleMesh, gl.POINTS)
  })

  // Position simulation
  positionTexture.drawTo(alternate => {
    clear()

    alternate.bind(1)
    velocityTexture.bind(2)
    birdTexture.bind(3)

    positionShader.uniforms({
      positionSampler: 1,
      velocitySampler: 2,
      originSampler: 3,
      init: init
    })

    positionShader.draw(particleMesh, gl.POINTS)
  })

  // Display
  clear()

  positionTexture.bind(0)
  velocityTexture.bind(1)

  displayShader.uniforms({
    positionSampler: 0,
    velocitySampler: 1
  })

  displayShader.draw(particleMesh, gl.POINTS)

  // cubeShader.draw(cubeMesh, gl.LINES)

  birdTexture.bind(0)

  init = false
}

window.addEventListener('load', () => {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.fullscreen()
  gl.animate()
})
