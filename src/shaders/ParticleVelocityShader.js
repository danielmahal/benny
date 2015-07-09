import forces from '../forces'

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
  uniform vec2 mouse;
  uniform bool init;

  ${
    // Inject force uniform
    Object.keys(forces).map(key => {
      return 'uniform sampler2D ' + key + 'ForceSampler;'
    })
  }

  void main() {
    vec2 velocity;

    if(init) {
      velocity = vec2(0.0, 0.0);
    } else {
      velocity = texture2D(velocitySampler, coord).rg;

      vec2 position = texture2D(positionSampler, coord).rg;

      ${
        // Apply force
        Object.keys(forces).map(key => {
          return 'velocity += texture2D(' + key + 'ForceSampler, coord).rg;'
        })
      }

      velocity *= 0.92;
    }

    gl_FragColor = vec4(velocity, 0, 0);
  }
`

export default function ParticleVelocityShader() {
  return new GL.Shader(vertex, fragment)
}
