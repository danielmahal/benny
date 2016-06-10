import lightgl from '../libs/lightgl'
import {assign, map, mapValues, times} from 'lodash'

import ParticleMesh from './meshes/ParticleMesh'
import GeometryMesh from './meshes/GeometryMesh'
import GeometryMeshSequence from './meshes/GeometryMeshSequence'

import GeometryShader from './shaders/GeometryShader'
import ParticleDisplayShader from './shaders/ParticleDisplayShader'
import ParticlePositionShader from './shaders/ParticlePositionShader'
import ParticleVelocityShader from './shaders/ParticleVelocityShader'

import SimulationTexture from './textures/PingPongTexture'
import PingPongTexture from './textures/PingPongTexture'

import Midi from './midi'
import prevMidi from './prevMidi'

import forces from './forces'

var gl = lightgl.create()

const simulationSize = 256

const originMeshes = [
  new GeometryMesh('birdTest01'),
  new GeometryMesh('move_text_01')
]

const midi = new Midi({
  drop: 0.5,
  origin: 0.5,
  noiseStrength: 0,
  noiseSize: 0.5,
  rotation: 0.5,
  zoom: 0.5,
  alpha: 0.5,
})

const originMeshSequences = [
  new GeometryMeshSequence('plane', 3, 1),
  new GeometryMeshSequence('sphere', 1, 1),
  // new GeometryMeshSequence('move', 1, 1),
  new GeometryMeshSequence('spiral', 2, 1),
  new GeometryMeshSequence('bird', 170, 20)
]

const particleMesh = new ParticleMesh(simulationSize)

const displayShader = new ParticleDisplayShader()
const positionShader = new ParticlePositionShader()
const velocityShader = new ParticleVelocityShader()
const geometryShader = new GeometryShader()

const forceShaders = mapValues(forces, (force, key) => new force.shader())

// Textures
const originTextures = map(originMeshes, () => new SimulationTexture(gl, simulationSize))

const originSequenceTextures = map(originMeshSequences, sequence => {
  return sequence.frames.map(() => new SimulationTexture(gl, simulationSize))
})

const birdTexture = new SimulationTexture(gl, simulationSize)
const positionTexture = new PingPongTexture(gl, simulationSize)
const velocityTexture = new PingPongTexture(gl, simulationSize)

const forceTextures = {
  drop: new SimulationTexture(gl, simulationSize),
  noise: new SimulationTexture(gl, simulationSize)
}

function clear () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

let time = 0
let init = true
let currentOrigin = 0

gl.onupdate = () => {
  time++

  times(4, i => {
    // Midi pad 5-8
    if (prevMidi.pad[i + 4]) {
      currentOrigin = i
    }
  })
}

gl.ondraw = () => {
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  gl.loadIdentity()
  gl.translate(0, 0, -(1-midi.params.zoom) * 4)
  gl.rotate(midi.params.rotation * 180, 0, -1, 0)

  originTextures.forEach((texture, i) => {
    const mesh = originMeshes[i]

    if (mesh.changed) {
      mesh.changed = false

      texture.drawTo(() => {
        geometryShader.draw(mesh, gl.POINTS)
      })
    }
  })

  originSequenceTextures.forEach((textures, sequenceIndex) => {
    const sequence = originMeshSequences[sequenceIndex]

    if (sequence.changed) {
      sequence.changed = false

      textures.forEach((texture, textureIndex) => {
        const mesh = sequence.frames[textureIndex]

        texture.drawTo(() => {
          geometryShader.draw(mesh, gl.POINTS)
        })
      })
    }
  })

  const currentOriginSequence = originMeshSequences[currentOrigin]
  const currentOriginTexture = originSequenceTextures[currentOrigin][time % currentOriginSequence.frames.length]
  // const currentOriginTexture = originTextures[currentOrigin]

  const forceUniforms = {
    drop: {
      dropPosition: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 3 - 1.5],
      strength: Math.pow((midi.params.drop - 0.5) * 3, 5)
    },

    origin: {
      strength: Math.pow(midi.params.origin, 2) * 0.2
    },

    noise: {
      size: 20 - midi.params.noiseSize * 19.9,
      strength: midi.params.noiseStrength * 0.5,
      time: time / 1000
    }
  }

  // Forces simulation
  Object.keys(forces).forEach(key => {
    forceTextures[key].drawTo(() => {
      const shader = forceShaders[key]

      positionTexture.bind(1)
      velocityTexture.bind(2)
      currentOriginTexture.bind(3)

      shader.uniforms(assign({
        positionSampler: 1,
        velocitySampler: 2,
        originSampler: 3
      }, forceUniforms[key]))

      shader.draw(particleMesh, gl.POINTS)
    })
  })

  // Velocity simulation
  velocityTexture.drawTo(alternate => {
    clear()

    alternate.bind(1)
    positionTexture.bind(2)
    currentOriginTexture.bind(3)

    forceTextures.drop.bind(4)
    forceTextures.noise.bind(5)

    velocityShader.uniforms({
      velocitySampler: 1,
      positionSampler: 2,
      targetSampler: 3,
      dropForceSampler: 4,
      noiseForceSampler: 5,
      targetStrength: forceUniforms.origin.strength,
      reset: !!prevMidi.pad[2]
    })

    velocityShader.draw(particleMesh, gl.POINTS)
  })

  // Position simulation
  positionTexture.drawTo(alternate => {
    clear()

    alternate.bind(1)
    velocityTexture.bind(2)
    currentOriginTexture.bind(3)

    positionShader.uniforms({
      positionSampler: 1,
      velocitySampler: 2,
      originSampler: 3,
      init: init,
      direction: (prevMidi.pad[0] ? -1 : 1),
      reset: !!prevMidi.pad[2]
    })

    positionShader.draw(particleMesh, gl.POINTS)
  })

  // Display
  clear()

  positionTexture.bind(0)
  velocityTexture.bind(1)

  if (prevMidi.pad[1]) {
    currentOriginTexture.bind(0)
  }

  displayShader.uniforms({
    positionSampler: 0,
    velocitySampler: 1,
    brightness: midi.params.alpha
  })

  displayShader.draw(particleMesh, gl.POINTS)

  birdTexture.bind(0)

  init = false
}

window.addEventListener('load', () => {
  document.body.appendChild(midi.container)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_PLUS_SRC_ALPHA)
  gl.disable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.fullscreen()
  gl.animate()
})
