import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';

const EpisodePage = () => {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEpisode(data);
      } catch (error) {
        console.error('Error fetching episode:', error.message);
        setError(error.message);
      }
    };

    fetchEpisode();
  }, [id]);

  if (error) {
    return <h1>Error: {error}</h1>;
  }

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



