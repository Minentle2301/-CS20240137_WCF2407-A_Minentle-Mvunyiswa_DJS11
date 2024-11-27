import React from "react";
import { useNavigate } from "react-router-dom";
import genreTitles from "../Pages/HomePage";

const PodcastPreview = ({
  show,
  isFavorite,
  addFavorite,
  removeFavorite,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/show/${show.id}`);
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(show.id);
    } else {
      addFavorite(show.id);
    }
  };

  return (
    <div
      className="podcast-preview"
      onClick={handleNavigate}
      style={{ cursor: "pointer" }}
    >
      <img src={show.image} alt={show.title} className="podcast-image" />
      <h3>{show.title}</h3>
      <p>{show.description}</p>
      <p className="genre">Genre: {genreTitles[show.genre_id]}</p>
     
    </div>
  );
};

export default PodcastPreview;