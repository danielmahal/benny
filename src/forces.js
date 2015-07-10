import DropForceShader from './shaders/DropForceShader'
import OriginForceShader from './shaders/OriginForceShader'
import NoiseForceShader from './shaders/NoiseForceShader'

export default {
  drop: { shader: DropForceShader },
  center: { shader: DropForceShader },
  origin: { shader: OriginForceShader },
  noise: { shader: NoiseForceShader },
}
