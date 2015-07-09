import vertex from './simulation-vertex.glsl'

export default function ParticleVelocityShader(fragment) {
  return new GL.Shader(vertex, fragment)
}
