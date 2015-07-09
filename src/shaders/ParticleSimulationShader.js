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
  uniform sampler2D sampler;
  uniform vec2 mouse;
  uniform bool init;

  void main() {
    vec2 position, velocity;
    vec2 center = vec2(0.5, 0.5);

    if(init) {
      velocity = vec2(0.0, 0.0);
      position = coord;
    } else {
      vec4 sample = texture2D(sampler, coord);
      velocity = sample.ba;
      position = sample.rg;

      float mouseDistance = distance(position, mouse);
      vec2 mouseDiff = position - mouse;
      vec2 mouseForce = mouseDiff / pow(mouseDistance, 2.4) * 0.00001;

      velocity += mouseForce;

      velocity *= 0.92;

      position += velocity;
    }

    gl_FragColor = vec4(position, velocity);
  }
`

export default function SimulationShader() {
  return new GL.Shader(vertex, fragment)
}
