import React from 'react'

export default class ControlGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      expanded: true
    }
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render() {
    const {expanded} = this.state

    const headerStyle = {
      color: expanded ? 'white' : '#888',
      background: expanded ? '#333' : 'black',
      borderBottom: '1px black solid',
      cursor: 'pointer',
      padding: '1em'
    }

    return (
      <div>
        <header style={headerStyle} onClick={this.toggleExpanded.bind(this)}>
          {this.props.label}
        </header>

        {this.state.expanded && this.props.children}
      </div>
    )
  }
}
