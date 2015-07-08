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

  onChange(e) {
    this.props.onChange(JSON.parse(e.currentTarget.value))
  }

  render() {
    const {expanded} = this.state

    const style = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: this.state.expanded ? 0 : 'auto',
      bottom: this.state.expanded ? 0 : 'auto',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white'
    }

    const headerStyle = {
      cursor: 'pointer',
      padding: '1em'
    }

    const textareaStyle = {
      fontFamily: 'inherit',
      background: 'transparent',
      color: 'inherit',
      border: '0',
      outline: 'none',
      flex: 1,
      resize: 'none',
      padding: '1em'
    }

    return (
      <div style={style}>
        <header style={headerStyle} onClick={this.toggleExpanded.bind(this)}>
          {this.state.expanded ? 'Close controls' : 'Open controls'}
        </header>

        { this.state.expanded &&
          <textarea
            style={textareaStyle}
            value={JSON.stringify(this.props.value, null, '  ')}
            onChange={this.onChange.bind(this)} />
        }
      </div>
    )
  }
}
