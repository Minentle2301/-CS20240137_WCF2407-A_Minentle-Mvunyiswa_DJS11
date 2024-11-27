// SeasonPage.js - Displays details for a specific season of a podcast

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const SeasonPage = () => {
  const { seasonId } = useParams(); // Extract the season ID from the URL parameters
  const [season, setSeason] = useState(null);

  useEffect(() => {
    if (seasonId) {
      // Fetch show details using the ID as seasonId
      axios
        .get(`https://podcast-api.netlify.app/id/${seasonId}`)
        .then((response) => {
          setSeason(response.data);
        })
        .catch((error) => {
          console.error("Error fetching show details:", error);
        });
    }
  }, [seasonId]);

  if (!season) {
    return <div>Loading...</div>;
  }

  return (
    <div className="show-details">
      <h2>Season {seasonId}</h2>
      <img src={season.image} alt={season.title} className="show-image" />
      <h1>{season.title}</h1>
      <p>{season.description}</p>
      <p>Last Updated: {new Date(season.updated).toLocaleDateString()}</p>
      <p>
        Genres: {season.genres?.map((genre) => genre).join(", ") || "N/A"}
      </p>
      <div className="episodes">
        {season.episodes.map((episode, index) => (
          <div key={index}>
            {/* Use index as key for the episode */}
            <h3>{episode.title}</h3>
            <p>{episode.description}</p>
            <Link to={`/episode/${episode.id}`}>Listen</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonPage;
