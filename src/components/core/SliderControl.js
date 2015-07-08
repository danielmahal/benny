import React from 'react'

import Control from './Control'

class SliderControlBarValue extends React.Component {
  render() {
    const style = {
      position: 'absolute',
      width: this.props.width + '%',
      background: '#333',
      top: 0,
      bottom: 0,
      boxSizing: 'border-box'
    }

    return <div style={style}>{this.props.value}</div>
  }
}

class SliderControlBar extends React.Component {
  constructor(props) {
    super(props)

    this.setValueFromEvent = this.setValueFromEvent.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
  }

  setValueFromEvent(e) {
    const rect = React.findDOMNode(this).getBoundingClientRect()
    const x = e.clientX
    const percent = ((x - rect.left) / rect.width) * 100
    const value = this.getValue(percent)
    const stepped = Math.round(value / this.props.step) * this.props.step
    const clamped = Math.min(this.props.max, Math.max(this.props.min, stepped))

    this.props.setValue(clamped)
  }

  onMouseUp() {
    document.removeEventListener('mousemove', this.setValueFromEvent)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  onMouseDown(e) {
    this.setValueFromEvent(e)

    const eventHandler = this.setValueFromEvent.bind(this)

    document.addEventListener('mousemove', this.setValueFromEvent)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  getRange() {
    return this.props.max - this.props.min
  }

  getValue(percent) {
    return (percent / 100) * this.getRange() + this.props.min
  }

  getPercent(value) {
    return ((this.props.value / this.getRange()) - (this.props.min / this.getRange())) * 100
  }

  render() {
    const style = {
      minWidth: 150,
      position: 'relative',
      cursor: 'ew-resize'
    }

    return (
      <div style={style} onMouseDown={this.onMouseDown.bind(this)}>
        <SliderControlBarValue width={this.getPercent()} value={this.props.value} />
      </div>
    )
  }
}

export default class SliderControl extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.defaultValue
    }
  }

  setValue(value) {
    this.setState({
      value: value
    })

    this.props.onChange(value)
  }

  render() {
    const {min, max, step} = this.props

    const props = {
      value: this.state.value,
      setValue: this.setValue.bind(this),
      min: min,
      max: max,
      step: step
    }

    return (
      <Control label={this.props.label}>
        <SliderControlBar {...props} />
      </Control>
    )
  }
}
