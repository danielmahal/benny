import React from 'react'

export default class Control extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex' }}>
        <header style={{ padding: '1em' }}>
          {this.props.label}
        </header>

        {this.props.children}
      </div>
    )
  }
}
