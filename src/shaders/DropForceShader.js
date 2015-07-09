import SimulationShader from './SimulationShader'

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
  return new SimulationShader(fragment)
}
