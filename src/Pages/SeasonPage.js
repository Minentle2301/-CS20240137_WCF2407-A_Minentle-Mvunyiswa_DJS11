// SeasonPage.js - 

// Import necessary libraries and hooks
import React, { useEffect, useState } from "react"; // React for components, useEffect for side effects, and useState for state management
import { useParams, Link } from "react-router-dom"; // useParams for accessing route parameters and Link for navigation
import axios from "axios"; // Axios for making HTTP requests

// Define the SeasonPage component
const SeasonPage = () => {
  // Extract the `seasonId` parameter from the URL using the useParams hook
  const { seasonId } = useParams();

  // State to hold the season details fetched from the API
  const [season, setSeason] = useState(null);

  // useEffect hook to fetch data when the component mounts or `seasonId` changes
  useEffect(() => {
    if (seasonId) {
      // Make an API request to fetch the season details using the provided `seasonId`
      axios
        .get(`https://podcast-api.netlify.app/id/${seasonId}`) // API endpoint with the season ID
        .then((response) => {
          setSeason(response.data); // Update the `season` state with the fetched data
        })
        .catch((error) => {
          console.error("Error fetching show details:", error); // Log any errors to the console
        });
    }
  }, [seasonId]); // Dependency array ensures this effect runs when `seasonId` changes

  // Conditional rendering: Display a loading message while the data is being fetched
  if (!season) {
    return <div>Loading...</div>; // Show this message until the API call is complete
  }

  // Render the season details once the data is loaded
  return (
    <div className="show-details">
      {/* Display the season number */}
      <h2>Season {seasonId}</h2>

      {/* Display the season's image */}
      <img src={season.image} alt={season.title} className="show-image" />

      {/* Display the season's title and description */}
      <h1>{season.title}</h1>
      <p>{season.description}</p>

      {/* Display the last updated date formatted to a readable format */}
      <p>Last Updated: {new Date(season.updated).toLocaleDateString()}</p>

      {/* Display the genres, if available, as a comma-separated list */}
      <p>
        Genres: {season.genres?.map((genre) => genre).join(", ") || "N/A"}
      </p>

      {/* Display the list of episodes */}
      <div className="episodes">
        {season.episodes.map((episode, index) => (
          <div key={index}> {/* Use the index as the key for rendering episodes */}
            {/* Episode title */}
            <h3>{episode.title}</h3>

            {/* Episode description */}
            <p>{episode.description}</p>

            {/* Link to the specific episode's page */}
            <Link to={`/episode/${episode.id}`}>Listen</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the SeasonPage component as the default export
export default SeasonPage;
