// SeasonPage.js - Displays details for a specific season of a podcast

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';  // Importing hooks to get URL params and navigate
import axios from 'axios';  // Import axios to make API requests

const SeasonPage = () => {
  const { seasonId } = useParams();  // Extract the season ID from the URL parameters
  const [season, setSeason] = useState(null);  // State to store the season details

  useEffect(() => {
    if (seasonId) {  // Check if `seasonId` exists before making the API request
      // Fetch season details based on the seasonId
      axios
        .get(`https://podcast-api.netlify.app/season/${seasonId}`)  // Make the GET request to fetch season data
        .then((response) => {
          setSeason(response.data);  // On success, store the fetched data in `season` state
        })
        .catch((error) => {
          console.error('Error fetching season details:', error);  // Handle errors
        });
    }
  }, [seasonId]);  // Effect will run whenever `seasonId` changes

  if (!season) {
    return <div>Loading...</div>;  // Display loading text until season data is fetched
  }

  return (
    <div className="season-details">
      <h2>Season {season.number}</h2>  {/* Display the season number */}
      <div className="episodes">
        {/* Loop through episodes in the season and display each */}
        {season.episodes.map((episode) => (
          <div key={episode.id} className="episode">  {/* Use `episode.id` as a unique key */}
            <h3>{episode.title}</h3>  {/* Display episode title */}
            <p>{episode.description}</p>  {/* Display episode description */}
            <Link to={`/episode/${episode.id}`}>Listen</Link>  {/* Link to the episode page */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonPage;
