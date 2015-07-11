import lightgl from '../../libs/lightgl'

export default function DebugMesh() {
  var mesh = new lightgl.Mesh({
    coords: true,
    triangles: false
  });

  mesh.vertices = [
    [0, 0], [1, 0], [0, 1],
    [1, 0], [1, 1], [0, 1]
  ]

  mesh.compile();

  return mesh
}
