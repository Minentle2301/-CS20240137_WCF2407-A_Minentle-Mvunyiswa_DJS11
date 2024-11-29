// Import React and React hooks for state management and lifecycle handling
import React, { useState, useEffect } from 'react';

// Import React Router components for navigation and routing
import { Routes, Route } from 'react-router-dom';

// Importing different pages and components for the application
import HomePage from './Pages/HomePage';
import GenrePage from './Pages/GenrePage';
import ShowDetails from './components/ShowDetails';
import EpisodePage from './Pages/EpisodePage';
import FavoritesPage from './Pages/FavoritesPage';

// Import API utility function for fetching podcast previews
import { fetchPreviews } from './utils/api';

// Importing global stylesheet for the app
import './styles.css';

// Main App component
const App = () => {
  // State to manage the list of favorite podcast IDs
  const [favorites, setFavorites] = useState(() => {
    // Retrieve saved favorites from localStorage on initial load
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return savedFavorites; // Return the retrieved array or an empty array if none found
  });

  // State to store the list of podcast previews
  const [previews, setPreviews] = useState([]);

  // Effect to fetch podcast previews when the component mounts
  useEffect(() => {
    fetchPreviews() // Fetch podcast previews from the API
      .then((response) => {
        setPreviews(response.data); // Store the fetched data in the state
      })
      .catch((error) => {
        console.error('Error fetching previews:', error); // Log any errors that occur
      });
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  // Effect to persist the favorites list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Save favorites as a JSON string in localStorage
  }, [favorites]); // Run this effect whenever `favorites` changes

  // Function to handle adding or removing a podcast from the favorites list
  const handleFavorite = (showId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(showId); // Check if the show is already a favorite
      if (isFavorite) {
        // Remove from favorites if already present
        return prevFavorites.filter((id) => id !== showId);
      } else {
        // Add to favorites if not present
        return [...prevFavorites, showId];
      }
    });
  };

  return (
    // Main container for the app
    <div className="app">
      {/* Define routes for navigation using React Router */}
      <Routes>
        {/* HomePage route: Displays the main list of podcasts */}
        <Route
          path="/"
          element={<HomePage favorites={favorites} handleFavorite={handleFavorite} />}
        />

        {/* GenrePage route: Displays podcasts filtered by genre */}
        <Route path="/genre/:id" element={<GenrePage />} />

        {/* ShowDetails route: Displays detailed information about a selected podcast */}
        <Route
          path="/show/:id"
          element={
            <ShowDetails
              favorites={favorites}
              addFavorite={handleFavorite}
              removeFavorite={handleFavorite}
            />
          }
        />

        {/* EpisodePage route: Displays the episodes for a selected podcast season */}
        <Route path="/season/:id" element={<EpisodePage />} />

        {/* FavoritesPage route: Displays the list of favorited podcasts */}
        <Route
          path="/favorites"
          element={<FavoritesPage favorites={favorites} previews={previews} />}
        />
      </Routes>
    </div>
  );
};

// Export the App component as the default export of this module
export default App;
