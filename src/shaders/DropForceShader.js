import SimulationShader from './SimulationShader'

const fragment = `
  varying vec2 coord;
  uniform sampler2D positionSampler;
  uniform vec2 dropPosition;
  uniform float strength;

  void main() {
    vec2 position = texture2D(positionSampler, coord).rg;

    float dropDistance = distance(position, dropPosition);
    vec2 dropDiff = position - dropPosition;

    vec2 force = dropDiff / pow(dropDistance, 2.4) * strength * 0.001;

    gl_FragColor = vec4(force, 0, 0);
  }
`

export default function DropForceShader() {
  return new SimulationShader(fragment)
}
