import SimulationShader from './SimulationShader'
import forces from '../forces'

const fragment = `
  varying vec2 coord;
  uniform sampler2D positionSampler;
  uniform sampler2D velocitySampler;
  uniform bool reset;

  ${
    // Inject force uniforms
    Object.keys(forces).map(key => {
      return 'uniform sampler2D ' + key + 'ForceSampler;'
    }).join('\n')
  }

  void main() {
    vec3 velocity = texture2D(velocitySampler, coord).rgb;
    vec3 position = texture2D(positionSampler, coord).rgb;

    if(reset) {
      velocity *= 0.0;
    } else {
      ${
        // Apply force
        Object.keys(forces).map(key => {
          return 'velocity += texture2D(' + key + 'ForceSampler, coord).rgb;'
        }).join('\n')
      }

      velocity *= 0.92;
    }

    gl_FragColor = vec4(velocity, 0);
  }
`

export default function ParticleVelocityShader() {
  return new SimulationShader(fragment)
}
