// ShowPage.js - Fetches and displays details of a specific show (podcast)

// Import necessary hooks and libraries
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';  // Import Link to navigate and useParams to get route params
import axios from 'axios';  // Import axios for API requests

const ShowPage = () => {
  const { id } = useParams();  // Get podcast ID from URL (e.g. /show/:id)
  const [show, setShow] = useState(null);  // State to store show data

  useEffect(() => {
    // Fetch show details using the podcast ID from the URL
    axios
      .get(`https://podcast-api.netlify.app/id/${id}`)  // Fetch data from API
      .then((response) => setShow(response.data))  // On success, set the show data
      .catch((error) => {
        console.error('Error fetching show details:', error);  // Log any errors
      });
  }, [id]);  // Re-run effect whenever the `id` changes

  if (!show) {
    return <div>Loading...</div>;  // Display loading message while data is being fetched
  }

  return (
    <div className="show-details">
      <h1>{show.title}</h1>  {/* Display the title of the show */}
      <p>{show.description}</p>  {/* Display the description of the show */}
      <div className="seasons">
        {/* Render list of seasons dynamically using the map function */}
        {show.seasons.map((season) => (
          <Link
            key={season.id}  // Ensure each Link has a unique key (necessary for React to optimize rendering)
            to={`/season/${season.id}`}  // Link to the season details page using the season's ID
            className="season-link"
          >
            Season {season.number}  {/* Display the season number */}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowPage;
