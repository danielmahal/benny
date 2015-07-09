const vertex = `
  varying vec2 coord;

  void main() {
    coord = gl_Vertex.xy;

    vec4 offset = vec4(-0.5, -0.5, 0.0, -0.5);

    gl_Position = vec4(coord, 0.0, 1.0) + offset;
  }
`

const fragment = `
  varying vec2 coord;
  uniform sampler2D positionSampler;
  uniform sampler2D velocitySampler;
  uniform bool init;

  void main() {
    vec2 position;

    if(init) {
      position = coord;
    } else {
      position = texture2D(positionSampler, coord).rg;

      vec2 velocity = texture2D(velocitySampler, coord).rg;

      position += velocity;
    }

    gl_FragColor = vec4(position, 0, 0);
  }
`

export default function ParticlePositionShader() {
  return new GL.Shader(vertex, fragment)
}
