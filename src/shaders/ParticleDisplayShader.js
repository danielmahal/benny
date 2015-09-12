import lightgl from '../../libs/lightgl'

const vertex = `
  uniform sampler2D positionSampler;
  uniform sampler2D velocitySampler;
  varying vec2 position;
  varying vec2 velocity;

  void main() {
    vec4 offset = vec4(-0.5, -0.5, 0.0, -0.5);

    position = texture2D(positionSampler, gl_Vertex.xy).rg;
    velocity = texture2D(velocitySampler, gl_Vertex.xy).rg;

    gl_PointSize = 2.0;
    gl_Position = vec4(position, 0.0, 1.0) + offset;
  }
`

const fragment = `
  varying vec2 velocity;

  void main() {
    float speed = length(velocity) * 1000.0 + 0.4;

    gl_FragColor = vec4(speed, speed, speed, 1.0);
  }
`

export default function ParticleDisplayShader() {
  return new lightgl.Shader(vertex, fragment)
}
