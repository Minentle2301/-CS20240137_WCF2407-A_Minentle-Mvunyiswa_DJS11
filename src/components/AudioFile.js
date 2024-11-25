import React, { useState } from 'react';

const AudioPlayer = ({ src }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="audio-player">
      <audio src={src} controls autoPlay={playing} />
      <button onClick={() => setPlaying(!playing)}>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default AudioPlayer;
