import {times} from 'lodash'

import GeometryMesh from './GeometryMesh';

const sequenceContext = require.context('../geometry/sequences');

function loadFrameGeometry(name, callback) {
  console.log('load frame geometry', sequenceContext(`./${name}.json`));

  return fetch(sequenceContext(`./${name}.json`)).then(data => {
    console.log('frame loaded', name);
    return data.json();
  })
}

export default function GeometryMeshSequence(sequenceName, start, length, size, parser) {
  const sequence = {
    frames: times(length)
  };

  const loadFrames = times(length, i => {
    return loadFrameGeometry(`${sequenceName}/${sequenceName}_${(start + i)}`);
  });

  Promise.all(loadFrames).then(frames => {
    sequence.frames = frames.map(frame => {
      return new GeometryMesh(frame, size, parser);
    });

    sequence.changed = true;

    console.log('done making sequence', sequence);
  });

  return sequence;
}
