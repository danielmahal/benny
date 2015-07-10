import times from 'lodash/utility/times'
import lightgl from '../../libs/lightgl'

export default function ParticleMesh(size) {
  var mesh = new lightgl.Mesh({
    coords: true,
    triangles: false
  })

  times(size, x => {
    times(size, y => {
      mesh.vertices.push([
        x / size,
        y / size
      ])
    })
  })

  mesh.compile()

  return mesh
}
