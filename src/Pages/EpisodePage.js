import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const EpisodePage = () => {
  const { id } = useParams(); // Get season ID from URL
  const [episodes, setEpisodes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch episodes for the given season ID
    axios
      .get(`https://podcast-api.netlify.app/season/${id}`)
      .then((response) => {
        setEpisodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching episodes:", error);
        setError("Failed to load episodes. Please try again later.");
      });
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!episodes.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="episodes-list">
      <h2>Season {id} Episodes</h2>
      {episodes.map((episode) => (
        <div key={episode.id} className="episode-details">
          <h3>{episode.title}</h3>
          <p>{episode.description}</p>
          <audio controls>
            <source src={episode.audio_url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default EpisodePage;





