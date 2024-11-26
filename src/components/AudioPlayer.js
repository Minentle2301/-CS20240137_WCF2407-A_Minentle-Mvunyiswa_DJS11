import React, { useRef, useState } from 'react';

const AudioPlayer = ({ src }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} />
      <button onClick={togglePlay}>
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default AudioPlayer;

