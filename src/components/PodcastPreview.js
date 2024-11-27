import React from "react";
import { useNavigate } from "react-router-dom";


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
    </div>
  );
};

export default PodcastPreview;