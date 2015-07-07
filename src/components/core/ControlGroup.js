import React from 'react'

export default class Controls extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  render() {
    const style = {
      padding: '1em'
    }

    return (
      <div style={style}>
        <header>› {this.props.label}</header>
        {this.expanded && this.props.children}
      </div>
    )
  }
}
