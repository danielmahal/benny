import React from 'react'

import Controls from './components/core/Controls'
import ControlGroup from './components/core/ControlGroup'
import SliderControl from './components/core/SliderControl'
import Layer from './components/core/Layer'

import PointGrid from './components/PointGrid'
import CrossGrid from './components/CrossGrid'

class Invert extends Layer {
  draw(context) {
    context.save()
    context.globalCompositeOperation = 'xor'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    context.restore()
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gridSize: 60
    }
  }

  onConfigChange(key, value) {
    this.setState({
      [key]: value
    })
  }

  render() {
    return (
      <div>
        <Controls>
          <ControlGroup label="Grid">
            <SliderControl label="Size" min={20} max={200} step={1} defaultValue={this.state.gridSize} onChange={this.onConfigChange.bind(this, 'gridSize')} />
          </ControlGroup>
        </Controls>

        <Layer>
          <Invert>
            <Layer debug>
              <PointGrid key="full" size={this.state.gridSize} pointSize={1} />
              <PointGrid key="half" size={this.state.gridSize / 3} pointSize={0.5} />
              <CrossGrid key="cross" size={this.state.gridSize} min={1} max={10} />
            </Layer>
          </Invert>
        </Layer>
      </div>
    )
  }
}

window.addEventListener('load', () => {
  React.render(<Application />, document.body)
})
