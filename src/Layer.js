import React from 'react'
import assign from 'lodash/object/assign'
import pluck from 'lodash/collection/pluck'
import sortBy from 'lodash/collection/sortBy'

export default class Layer extends React.Component {
  constructor(props) {
    super(props)

    this.childCanvases = {}
  }

  redraw() {
    this.clear()
    this.drawChildren()
    this.draw(this.canvasContext)
  }

  clear() {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  draw(context) {}

  drawChildren() {
    pluck(sortBy(this.childCanvases, 'order'), 'canvas').forEach(childCanvas => {
      this.canvasContext.drawImage(childCanvas, 0, 0)
    })
  }

  componentDidUpdate() {
    this.redraw()

    if(this.props.onUpdate) {
      this.props.onUpdate()
    }
  }

  componentDidMount() {
    this.canvas = React.findDOMNode(this.refs.canvas)
    this.canvasContext = this.canvas.getContext('2d')

    if(this.props.registerCanvas) {
      this.props.registerCanvas(this.canvas)
    }

    this.redraw()
  }

  componentWillUnmount() {
    if(this.props.unregisterCanvas) {
      this.props.unregisterCanvas(this.canvas)
    }
  }

  registerChildCanvas(key, index, canvas) {
    this.childCanvases[key] = {
      canvas: canvas,
      order: index
    }
  }

  unregisterChildCanvas(key, canvas) {
    delete this.childCanvases[key]
  }

  onChildUpdate() {
    this.redraw()
  }

  render() {
    const children = React.Children.map(this.props.children, (child, i) => {
      if(child) {
        return React.cloneElement(child, assign({}, child.props, {
          key: child.key,
          hasParent: true,
          onUpdate: this.onChildUpdate.bind(this),
          registerCanvas: this.registerChildCanvas.bind(this, child.key, i),
          unregisterCanvas: this.unregisterChildCanvas.bind(this, child.key)
        }))
      } else {
        return null
      }
    })

    const style = {
      border: '1px red solid',
      display: this.props.hasParent ? 'none' : 'block'
    }

    return (
      <div>
        <canvas ref="canvas" style={style} />
        {children}
      </div>
    )
  }
}
