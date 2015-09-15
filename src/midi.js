const midi = {
  pad: [],
  knob: []
};

export default midi;

const midiMap = {
  144: ({port, value}) => ({ type: 'pad', port: port - 36, value: true }),
  128: ({port, value}) => ({ type: 'pad', port: port - 36, value: false }),
  176: ({port, value}) => ({ type: 'knob', port: port - 1, value: value / 127 })
}

function onMessage(event) {
  // console.log('Midi message received', event.target.name, event.data)

  const typeId = event.data[0];

  const {type, port, value} = midiMap[typeId]({
    port: event.data[1],
    value: event.data[2]
  })

  midi[type][port] = value;

  console.log(JSON.stringify(midi));
}

function bindInputEvents(input) {
  console.log('Bind MIDI message event for', input)

  input.onmidimessage = onMessage
}

function onAccess(access) {
  console.log('MIDI access received', access)

  access.inputs.forEach(bindInputEvents)
}

function onReject() {
  console.error('MIDI access error')
}

console.log('Request MIDI access...')

navigator.requestMIDIAccess().then(onAccess, onReject)
