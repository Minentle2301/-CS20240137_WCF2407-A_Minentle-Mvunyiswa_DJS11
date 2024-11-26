import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ShowDetails = () => {
  const { id } = useParams(); // Get the podcast ID from the URL
  const [show, setShow] = useState(null);

  useEffect(() => {
    // Fetch show details using the ID
    axios
      .get(`https://podcast-api.netlify.app/id/${id}`) // Replace with your API endpoint
      .then((response) => setShow(response.data))
      .catch((error) => console.error('Error fetching show details:', error));
  }, [id]);

  if (!show) {
    return <div>Loading...</div>; // Display loading while fetching data
  }

  return (
    <div className="show-details">
      <h1>{show.title}</h1>
      <p>{show.description}</p>
      <div className="seasons">
        {show.seasons.map((season, index) => (
          <Link
            key={season.id || index}
            to={`/season/${season.id}`} // Navigate to the episodes of the selected season
            className="season-link"
          >
            Season {season.number}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowDetails;


