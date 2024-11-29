// Importing React library for creating React components
import React from 'react'; 

// Importing the Link component from React Router for navigation between routes
import { Link } from 'react-router-dom'; 

// Importing the PodcastPreview component for displaying individual podcast details
import PodcastPreview from '../components/PodcastPreview';

// Importing the CSS file to style the FavoritesPage component
import './FavoritesPage.css';

// Defining the FavoritesPage component and destructuring `favorites` and `previews` from props
const FavoritesPage = ({ favorites, previews }) => {
  
  // Filtering the list of all podcast previews to include only those that are marked as favorites
  const favoritePreviews = previews.filter((show) => favorites.includes(show.id));

  // Rendering the FavoritesPage component
  return (
    <div className="favorites-page">
      {/* Page title */}
      <h1>Your Favorite Podcasts</h1>
      
      {/* Container for displaying the grid of favorite podcast previews */}
      <div className="podcast-grid">
        {favoritePreviews.length > 0 ? ( // Check if there are any favorite podcasts
          favoritePreviews.map((show) => ( // Map through the favorite podcasts and render each one using PodcastPreview
            <PodcastPreview key={show.id} show={show} /> // Pass each podcast's details to the PodcastPreview component
          ))
        ) : (
          // Message displayed when no favorite podcasts are available
          <p>You don't have any favorite podcasts yet.</p>
        )}
      </div>

      {/* Link to navigate back to the main page displaying all podcasts */}
      <Link to="/" className="back-link">Back to All Podcasts</Link>
    </div>
  );
};

// Exporting the FavoritesPage component for use in other parts of the application
export default FavoritesPage;

