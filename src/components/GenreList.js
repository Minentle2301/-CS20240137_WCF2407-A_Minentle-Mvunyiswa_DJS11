// Importing React library to define the component
import React from 'react';

// Importing Link component from react-router-dom to handle navigation between different routes
import { Link } from 'react-router-dom';

// GenreList component is a functional component that receives a `genres` prop
const GenreList = ({ genres }) => {
  return (
    // The parent div that wraps the entire genre list with a class for styling
    <div className="genre-list">
      {/* Iterates over the 'genres' array to render each genre */}
      {genres.map((genre) => (
        // Each genre is wrapped in a Link component to navigate to the genre's specific page
        <Link key={genre.id} to={`/genre/${genre.id}`}>
          {/* The genre item displays the genre name */}
          <div className="genre-item">{genre.name}</div>
        </Link>
      ))}
    </div>
  );
};

// Exporting the GenreList component to be used in other parts of the application
export default GenreList;


