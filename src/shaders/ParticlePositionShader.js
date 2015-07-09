import SimulationShader from './SimulationShader'

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
  return new SimulationShader(fragment)
}
