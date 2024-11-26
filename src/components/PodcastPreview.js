import React from 'react';
import { useNavigate } from 'react-router-dom';
import genreTitles from '../Pages/HomePage'; // Make sure genreTitles is correctly passed or imported

const PodcastPreview = ({ show }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/show/${show.id}`); // Navigate to the show's details page
  };

  return (
    <div
      className="podcast-preview"
      onClick={handleNavigate}
      style={{ cursor: 'pointer' }}
    >
      <img src={show.image} alt={show.title} className="podcast-image" />
      <h3>{show.title}</h3>
      <p>{show.description}</p>
      <p className="genre">Genre: {genreTitles[show.genre_id]}</p>
    </div>
  );
};

export default PodcastPreview;
