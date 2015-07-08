import React from 'react'

import Controls from './components/core/Controls'
import Layer from './components/core/Layer'

import Invert from './components/Invert'

class Application extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      config: {
        grid: {
          size: 120
        }
      }
    }
  }

  onConfigChange(config) {
    this.setState({config})
  }

  render() {
    return (
      <div>
        <Controls value={this.state.config} onChange={this.onConfigChange.bind(this)} />

        <Layer>
          <Invert>
          </Invert>
        </Layer>
      </div>
    )
  }
}

window.addEventListener('load', () => {
  React.render(<Application />, document.body)
})
