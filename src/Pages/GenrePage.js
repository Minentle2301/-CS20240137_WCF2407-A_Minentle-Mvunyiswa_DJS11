// Import necessary modules
import React, { useEffect, useState } from 'react'; // Import React, useEffect, and useState hooks
import { useParams } from 'react-router-dom'; // Import useParams to access URL parameters
import { fetchGenre } from '../utils/api'; // Import the function to fetch genre data from the API
import PodcastPreview from '../components/PodcastPreview'; // Import PodcastPreview component to display each podcast

// GenrePage functional component
const GenrePage = () => {
  const { id } = useParams(); // Use useParams hook to get the genre ID from the URL
  const [genre, setGenre] = useState(null); // State to store the genre data fetched from the API

  // useEffect hook to fetch genre data when the component mounts or the genre ID changes
  useEffect(() => {
    fetchGenre(id) // Call the fetchGenre function to fetch data based on the genre ID
      .then((response) => setGenre(response.data)) // On successful fetch, set the genre data to the state
      .catch((error) => console.error(error)); // Log any errors that occur during the fetch
  }, [id]); // The effect depends on the genre ID, so it will run again when the ID changes

  // Render the component based on whether genre data has been fetched
  return genre ? ( // Check if genre data has been successfully fetched
    <div className="genre-page"> {/* Main container for the genre page */}
      <h1>{genre.name}</h1> {/* Display the name of the genre */}
      <div className="podcast-grid"> {/* Container for the list of podcasts */}
        {genre.shows.map((show) => ( // Map through each podcast in the genre's shows list
          <PodcastPreview key={show.id} show={show} /> // For each podcast, render a PodcastPreview component with show details
        ))}
      </div>
    </div>
  ) : (
    <p>Loading...</p> // If genre data is not yet available, display a loading message
  );
};

export default GenrePage; // Export the GenrePage component for use in other parts of the app
