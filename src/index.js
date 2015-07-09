import ParticleMesh from './meshes/ParticleMesh'
import ParticleDisplayShader from './shaders/ParticleDisplayShader'
import ParticleSimulationShader from './shaders/ParticleSimulationShader'
import PingPongTexture from './textures/PingPongTexture'

var gl = GL.create()

const simulationSize = 512

const mesh = new ParticleMesh(simulationSize)

const displayShader = new ParticleDisplayShader()
const simulationShader = new ParticleSimulationShader()

const simulationTexture = new PingPongTexture(gl, simulationSize)

function clear() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

let init = true

gl.ondraw = function() {
  // Simulate
  simulationTexture.drawTo(other => {
    clear()

    simulationShader.uniforms({
      sampler: other,
      mouse: [Math.random(), Math.random()],
      init: init
    })

    simulationShader.draw(mesh, gl.POINTS)
  })

  // Display
  clear()

  simulationTexture.bind(0)

  displayShader.uniforms({
    positionSampler: 0
  })

  displayShader.draw(mesh, gl.POINTS)

  init = false
}

window.addEventListener('load', () => {
  gl.fullscreen()
  gl.animate()
})
