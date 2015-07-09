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
  uniform vec2 dropPosition;

  void main() {
    vec2 position = texture2D(positionSampler, coord).rg;

    float mouseDistance = distance(position, dropPosition);
    vec2 mouseDiff = position - dropPosition;

    vec2 force = mouseDiff / pow(mouseDistance, 2.4) * 0.00001;

    gl_FragColor = vec4(force, 0, 0);
  }
`

export default function DropForceShader() {
  return new GL.Shader(vertex, fragment)
}
