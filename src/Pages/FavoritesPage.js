import React from 'react';
import { Link } from 'react-router-dom';  // Assuming you're using React Router for navigation
import PodcastPreview from '../components/PodcastPreview';
import './FavoritesPage.css';

const FavoritesPage = ({ favorites, previews }) => {
  const favoritePreviews = previews.filter((show) => favorites.includes(show.id));

  return (
    <div className="favorites-page">
      <h1>Your Favorite Podcasts</h1>
      <div className="podcast-grid">
        {favoritePreviews.length > 0 ? (
          favoritePreviews.map((show) => (
            <PodcastPreview key={show.id} show={show} />
          ))
        ) : (
          <p>You don't have any favorite podcasts yet.</p>
        )}
      </div>
      <Link to="/" className="back-link">Back to All Podcasts</Link>
    </div>
  );
};

export default FavoritesPage;
