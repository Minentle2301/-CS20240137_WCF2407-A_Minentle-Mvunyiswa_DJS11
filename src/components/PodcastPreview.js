// PodcastPreview.js
import React from 'react';
import genreTitles from '../Pages/HomePage';

const PodcastPreview = ({ show }) => {
  return (
    <div className="podcast-preview">
      <img src={show.image} alt={show.title} className="podcast-image" />
      <h3>{show.title}</h3>
      <p>{show.description}</p>
      <p className="genre">Genre: {genreTitles[show.genre_id]}</p> {/* Display the genre */}
    </div>
  );
};

export default PodcastPreview;
