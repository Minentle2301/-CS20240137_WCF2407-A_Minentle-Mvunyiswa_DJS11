// EpisodePage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EpisodePage = () => {
  const { episodeId } = useParams();  // Get episode ID from URL
  const [episode, setEpisode] = useState(null);

  useEffect(() => {
    // Fetch episode details using the episode ID
    axios
      .get(`https://podcast-api.netlify.app/episode/${episodeId}`)
      .then((response) => {
        setEpisode(response.data);
      })
      .catch((error) => {
        console.error('Error fetching episode details:', error);
      });
  }, [episodeId]);

  if (!episode) {
    return <div>Loading...</div>;  // Loading state
  }

  return (
    <div className="episode-details">
      <h2>{episode.title}</h2>
      <p>{episode.description}</p>
      <audio controls>
        <source src={episode.audio_url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default EpisodePage;




