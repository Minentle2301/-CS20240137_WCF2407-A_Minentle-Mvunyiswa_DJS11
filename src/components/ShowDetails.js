import React from 'react';
import { Link } from 'react-router-dom';

const ShowDetails = ({ show }) => {
  return (
    <div className="show-details">
      <h1>{show.title}</h1>
      <p>{show.description}</p>
      <div className="seasons">
      {show.seasons.map((season) => (
  <Link key={season.id} to={`/episode/${season.id}`}>
    Season {season.number}
  </Link>
))}

      </div>
    </div>
  );
};

export default ShowDetails;
