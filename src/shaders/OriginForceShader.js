import SimulationShader from './SimulationShader'

const fragment = `
  varying vec2 coord;
  uniform sampler2D positionSampler;
  uniform float strength;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 position = texture2D(positionSampler, coord).rg;

    vec2 diff = coord - position;
    vec2 force = diff * strength;

    gl_FragColor = vec4(force, 0, 0);
  }
`

export default function CenterForceShader() {
  return new SimulationShader(fragment)
}
