export default function SimulationTexture(gl, width, height) {
  return new GL.Texture(width, height || width, {
    magFilter: gl.NEAREST,
    minFilter: gl.NEAREST,
    type: gl.FLOAT
  });
}
