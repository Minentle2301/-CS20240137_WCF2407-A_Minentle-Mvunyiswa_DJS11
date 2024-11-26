import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';

const EpisodePage = () => {
  const { id } = useParams(); // Assuming the route includes an 'id' parameter
  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    // Fetch the episode data from your API or a state store
    const fetchEpisode = async () => {
      const response = await fetch(`https://podcast-api.netlify.app${id}`); // Replace with your API
      const data = await response.json();
      setEpisode(data);
    };

    fetchEpisode();
  }, [id]);

  if (!episode) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="episode-page">
      <h1>{episode.title}</h1>
      <AudioPlayer src={episode.audio} />
    </div>
  );
};

export default EpisodePage;


