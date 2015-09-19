import SimulationShader from './SimulationShader'

const fragment = `
  varying vec2 coord;
  uniform sampler2D originSampler;
  uniform sampler2D positionSampler;
  uniform sampler2D velocitySampler;
  uniform bool init;

  void main() {
    vec3 position;

    if(init) {
      position = vec3(coord, 0.0);
    } else {
      position = texture2D(positionSampler, coord).rgb;

      vec3 velocity = texture2D(velocitySampler, coord).rgb;

      position += velocity;
    }

    gl_FragColor = vec4(position, 0);
  }
`

export default function ParticlePositionShader() {
  return new SimulationShader(fragment)
}
