import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import './ShowDetails.css';

const ShowDetails = ({ favorites, addFavorite, removeFavorite }) => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://podcast-api.netlify.app/id/${id}`)
      .then((response) => {
        setShow(response.data);
      })
      .catch((error) => {
        console.error("Error fetching show details:", error);
        setError("Failed to load show details. Please try again later.");
      });
  }, [id]);

  const isFavorite = favorites.includes(show?.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(show.id);
    } else {
      addFavorite(show.id);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!show) {
    return <div>Loading...</div>;
  }

  return (
    <div className="show-details">
      <img src={show.image} alt={show.title} className="show-image" />
      <h1>{show.title}</h1>
      <p>{show.description}</p>

      <h2>Episodes</h2>
      <p>Last Updated: {new Date(show.updated).toLocaleDateString()}</p>
      <p>Genres: {show.genres?.join(", ") || "N/A"}</p>
      <div className="episodes">
        {show.episodes && show.episodes.length > 0 ? (
          show.episodes.map((episode) => (
            <Link key={episode.id} to={`/episode/${episode.id}`} className="episode-link">
              <h3>{episode.title}</h3>
              <p>{episode.description}</p>
            </Link>

          ))
        ) : (
          <p></p>
        )}
      </div>
      <div className="seasons">
    {show.seasons && show.seasons.length > 0 ? (
      show.seasons.map((season) => (
        <Link
          key={season.id}
          to={`/season/${season.id}`}
          className="season-link"
        >
          Season {season.number} (Episodes: {season.episodes.length})
        </Link>
      ))
    ) : (
      <p>No seasons available for this show.</p>
    )}
  </div>

      <Link to="/favorites">
    <button onClick={handleFavoriteToggle}>
      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  </Link>
    </div>
  );
};

export default ShowDetails;




