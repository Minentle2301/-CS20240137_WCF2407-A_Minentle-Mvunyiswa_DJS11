import React from 'react';
import { Link } from 'react-router-dom';


const PodcastPreview = ({ show }) => {
  return (
    <Link to={`/show/${show.id}`} className="podcast-preview">
      <h3>{show.title}</h3>
      <p>{show.description}</p>
    </Link>
  );
};

export default PodcastPreview;
