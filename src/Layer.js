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

  drawChildren() {
    pluck(sortBy(this.childCanvases, 'order'), 'canvas').forEach(childCanvas => {
      this.canvasContext.drawImage(childCanvas, 0, 0)
    })
  }

  draw(context) {}

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
    const {width, height} = this.props

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
      display: this.props.debug || !this.props.hasParent ? 'block' : 'none'
    }

    return (
      <div>
        <canvas ref="canvas" style={style} width={width} height={height} />
        {children}
      </div>
    )
  }
}

Layer.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight,
  debug: false
}
