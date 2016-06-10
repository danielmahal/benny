const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    fontFamily: 'monospace',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    display: 'none',
    zIndex: 10
  },

  param: {
    display: 'flex'
  },

  label: {
    flex: 1,
    padding: '0.5em 1em'
  },

  control: {
    flex: 1,
    padding: '0.5em 1em'
  },

  map: {
    width: '4em'
  }
};

Node.prototype.setStyle = function(styles) {
  styles && Object.keys(styles).forEach(key => this.style[key] = styles[key])
};

export default class Midi {
  constructor(params) {
    console.log('Request MIDI access...')

    this.container = document.createElement('div');
    this.container.setStyle(styles.container);

    params.tightness = 0.5;

    this.visible = false;
    this.params = params;
    this.targetParams = {};
    this.mapping = null;
    this.mappingNodes = {};
    this.inputNodes = {};
    this.midiMap = {};

    Object.keys(params).forEach(key => this.targetParams[key] = params[key]);

    const storedMap = JSON.parse(localStorage.getItem('midimap') || '{}');

    Object.keys(params).forEach(key => this.createParam(key, params[key]));

    Object.keys(storedMap).forEach(key => {
      if(storedMap[key] in params) {
        this.setMidiMap(key, storedMap[key])
      }
    });

    window.addEventListener('keydown', this.onKeyDown.bind(this));

    navigator.requestMIDIAccess().then(
      this.onAccess.bind(this),
      this.onReject.bind(this)
    );

    this.tick = this.tick.bind(this);
    this.tick();
  }

  tick() {
    requestAnimationFrame(this.tick);

    Object.keys(this.params).forEach(key => {
      if(key !== 'tightness') {
        this.params[key] += (this.targetParams[key] - this.params[key]) * this.params.tightness;
        this.inputNodes[key].value = this.params[key];
      }
    });
  }

  getDOMNode() {
    return this.container;
  }

  onAccess(access) {
    console.log('Got MIDI access', access);
    access.inputs.forEach(input => input.onmidimessage = this.onMessage.bind(this));
  }

  onReject() {
    console.error('MIDI access error')
  }

  onMessage(event) {
    const port = event.data[1];

    if(this.mapping) {
      this.setMidiMap(port, this.mapping);
    }

    const key = this.midiMap[port];

    if(key) {
      const value = this.getMidiValue(event);

      this.targetParams[key] = value;

      if(key == 'tightness') {
        this.params[key] = value;
        this.inputNodes[key].value = value;
      }

      this.targetParams[key] = value;
    }
  }

  getMidiValue(event) {
    const value = event.data[2];

    switch(event.data[0]) {
      default:
        return value / 127;
      break;
    }
  }

  setMidiMap(port, key) {
    this.midiMap[port] = key;
    this.mappingNodes[key].innerText = port;
    this.setMapping(null);
    localStorage.setItem('midimap', JSON.stringify(this.midiMap));
  }

  setMapping(key) {
    if(this.mapping) {
      this.mappingNodes[this.mapping].style.backgroundColor = '';
    }

    if(key) {
      this.mappingNodes[key].style.backgroundColor = 'yellow';
    }

    this.mapping = key;
  }

  onKeyDown() {
    console.log(event.keyCode);

    switch(event.keyCode) {
      case 27:
        this.toggle()
      break;
    }
  }

  toggle() {
    this.visible = !this.visible;
    this.getDOMNode().style.display = this.visible ? 'block' : 'none';
  }

  createParam(key, defaultValue) {
    const paramNode = document.createElement('div');
    const labelNode = document.createElement('div');
    const controlNode = document.createElement('div');
    const mapNode = document.createElement('button');

    this.mappingNodes[key] = mapNode;

    labelNode.innerText = key;
    mapNode.innerText = 'Map';

    paramNode.setStyle(styles.param);
    labelNode.setStyle(styles.label);
    controlNode.setStyle(styles.control);
    mapNode.setStyle(styles.map);

    paramNode.appendChild(labelNode);
    paramNode.appendChild(controlNode);
    paramNode.appendChild(mapNode);

    this.getDOMNode().appendChild(paramNode);

    if(typeof defaultValue === 'number') {
      const inputNode = document.createElement('input');

      this.inputNodes[key] = inputNode;

      inputNode.setAttribute('type', 'range');
      inputNode.setAttribute('value', defaultValue);
      inputNode.setAttribute('step', 0.001);
      inputNode.setAttribute('min', 0);
      inputNode.setAttribute('max', 1);

      inputNode.addEventListener('input', () => {
        this.params[key] = inputNode.value
      });

      controlNode.appendChild(inputNode);
    }

    mapNode.addEventListener('click', () => this.setMapping(key));
  }
}
