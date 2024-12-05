// Import necessary modules from React and Axios
import React, { useEffect, useState } from "react"; // Import React and hooks (useState, useEffect)
import { useParams } from "react-router-dom"; // Import useParams to get the dynamic URL parameter
import axios from "axios"; // Import Axios for making HTTP requests

// Define the EpisodePage component
const EpisodePage = () => {
  // useParams hook is used to extract dynamic parameters from the URL (in this case, the season ID)
  const { id } = useParams(); // Get the 'id' parameter from the URL (season ID)
  
  // State to store the list of episodes fetched from the API
  const [episodes, setEpisodes] = useState([]); // Initialize 'episodes' state as an empty array
  // State to store any error messages if the data fetching fails
  const [error, setError] = useState(null); // Initialize 'error' state as null

  // useEffect hook to fetch episode data whenever the season ID changes
  useEffect(() => {
    // Fetch episodes data for the given season ID when the component mounts or when 'id' changes
    axios
      .get(`https://podcast-api.netlify.app/season/${id}`) // Axios GET request to fetch data from the API
      .then((response) => {
        // On successful response, set the episodes data in the state
        setEpisodes(response.data); // Populate 'episodes' state with the fetched data
      })
      .catch((error) => {
        // If there's an error with the API request, log the error and set an error message in the state
        console.error("Error fetching episodes:", error); // Log the error to the console for debugging
        setError("Failed to load episodes. Please try again later."); // Set a user-friendly error message
      });
  }, [id]); // Dependency array ensures the effect runs when 'id' changes (e.g., when navigating to a new season)

  // If an error occurred while fetching data, display the error message
  if (error) {
    return <div>{error}</div>; // Return the error message to the user
  }

  // If episodes are still being fetched (empty array), display a loading message
  if (!episodes.length) {
    return <div>Loading...</div>; // Return a loading message until the data is fetched
  }

  // Render the episodes once the data is fetched successfully
  return (
    <div className="episodes-list">
      <h2>Season {id} Episodes</h2> {/* Display the season title (based on the dynamic 'id' parameter) */}
      
      {/* Map over the episodes and display each episode's details */}
      {episodes.map((episode) => (
        <div key={episode.id} className="episode-details"> {/* Each episode must have a unique 'key' */}
          <h3>{episode.title}</h3> {/* Display episode title */}
          <p>{episode.description}</p> {/* Display episode description */}
          
          {/* Audio player to play the episode audio */}
          <audio controls>
            <source src={episode.audio_url} type="audio/mp3" /> {/* Provide the audio file source */}
            Your browser does not support the audio element. {/* Fallback message if audio doesn't play */}
          </audio>
        </div>
      ))}
    </div>
  );
};

// Export the EpisodePage component for use in other parts of the application
export default EpisodePage;
