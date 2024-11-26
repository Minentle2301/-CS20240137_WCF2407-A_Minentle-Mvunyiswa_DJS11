import React from 'react';
import { Link } from 'react-router-dom';

const GenreList = ({ genres }) => {
  return (
    <div className="genre-list">
      {genres.map((genre) => (
        <Link key={genre.id} to={`/genre/${genre.id}`}>
          <div className="genre-item">{genre.name}</div>
        </Link>
      ))}
    </div>
  );
};

export default GenreList;

