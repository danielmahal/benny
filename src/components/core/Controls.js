import React from 'react'

export default class Controls extends React.Component {
  render() {
    const style = {
      position: 'absolute',
      top: 0,
      left: 0,
      fontFamily: 'monospace',
      background: 'black',
      color: 'white'
    }

    return (
      <div style={style}>
        {this.props.children}
      </div>
    )
  }
}
