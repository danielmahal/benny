import React from 'react'

export default function createCanvasContainer(Component) {
  class CanvasContainer extends React.Component {
    componentWillMount() {
      this.canvas = document.createElement('canvas')
      this.canvasContext = this.canvas.getContext('2d')
    }

    renderChild() {
      this.props.render(this.canvas)
    }

    render() {
      const props = {
        canvas: this.canvas,
        canvasContext: this.canvasContext,
        render: this.renderChild.bind(this)
      }

      return <Component {...this.props} {...props} />
    }
  }

  return CanvasContainer
}
