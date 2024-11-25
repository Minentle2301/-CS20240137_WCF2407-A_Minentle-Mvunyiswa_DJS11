import React from 'react';
import AudioPlayer from '../components/AudioPlayer';

const EpisodePage = ({ episode }) => {
  return (
    <div className="episode-page">
      <h1>{episode.title}</h1>
      <AudioPlayer src={episode.audio} />
    </div>
  );
};

export default EpisodePage;
