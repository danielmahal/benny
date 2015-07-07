import React from 'react'

import Controls from './components/core/Controls'
import ControlGroup from './components/core/ControlGroup'
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
  render() {
    return (
      <div>
        <Controls>
          <ControlGroup label="Grid">

          </ControlGroup>
        </Controls>

        <Layer>
          <Invert>
            <Layer debug>
              <PointGrid key="full" size={60} pointSize={3} />
              <PointGrid key="half" size={20} pointSize={1} />
              <CrossGrid key="cross" size={60} min={1} max={10} />
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
