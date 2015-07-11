import lightgl from '../../libs/lightgl'

const vertex = `
  uniform float size;
  uniform vec2 position;
  varying vec2 coord;

  void main() {
    coord = gl_Vertex.xy;

    gl_Position = vec4(coord, 0.0, 1.0);
  }
`

const fragment = `
  uniform sampler2D sampler;
  varying vec2 coord;

  void main() {
    gl_FragColor = texture2D(sampler, coord) * 10000.0;
  }
`

export default function SimulationDebugShader() {
  return new lightgl.Shader(vertex, fragment)
}
