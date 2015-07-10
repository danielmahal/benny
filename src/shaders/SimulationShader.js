import lightgl from '../../libs/lightgl'

import vertex from './simulation-vertex.glsl'

export default function ParticleVelocityShader(fragment) {
  return new lightgl.Shader(vertex, fragment)
}
