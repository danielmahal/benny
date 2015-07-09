const vertex = `
  uniform sampler2D positionSampler;
  varying vec2 position;
  varying vec2 velocity;

  void main() {
    vec4 offset = vec4(-0.5, -0.5, 0.0, -0.5);

    vec4 sample = texture2D(positionSampler, gl_Vertex.xy);

    position = sample.rg;
    velocity = sample.ba;

    gl_PointSize = 1.0;
    gl_Position = vec4(position, 0.0, 1.0) + offset;
  }
`

const fragment = `
  varying vec2 velocity;

  void main() {
    float speed = length(velocity) * 50.0 + 0.4;

    gl_FragColor = vec4(speed, speed, speed, 1.0);
  }
`

export default function ParticleDisplayShader() {
  return new GL.Shader(vertex, fragment)
}
