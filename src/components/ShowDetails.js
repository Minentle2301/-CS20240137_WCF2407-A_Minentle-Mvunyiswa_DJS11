import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ShowDetails.css'; // CSS file for styling

const ShowDetails = () => {
  const { id } = useParams(); // Get the podcast ID from the URL
  const [show, setShow] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch show details using the ID
    axios
      .get(`https://podcast-api.netlify.app/id/${id}`)
      .then((response) => setShow(response.data))
      .catch((error) => {
        console.error('Error fetching show details:', error);
        setError('Failed to load show details. Please try again later.');
      });
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!show) {
    return <div>Loading...</div>; // Display loading while fetching data
  }

  return (
    <div className="show-details">
      <img src={show.image} alt={show.title} className="show-image" />
      <h1>{show.title}</h1>
      <p>{show.description}</p>
      <p>Last Updated: {new Date(show.updated).toLocaleDateString()}</p>
      <p>
        Genres: {show.genres?.map((genre) => genre).join(', ') || 'N/A'}
      </p>
      <div className="seasons">
        {Array.from({ length: show.seasons }, (_, index) => (
          <Link
            key={index + 1}
            to={`/season/${index + 1}`}
            className="season-link"
          >
            Season {index + 1}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowDetails;




