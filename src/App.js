import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import GenrePage from './Pages/GenrePage';
import ShowDetails from './components/ShowDetails';
import EpisodePage from './Pages/EpisodePage';
import FavoritesPage from './Pages/FavoritesPage';
import { fetchPreviews } from './utils/api';
import './styles.css';

const App = () => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return savedFavorites;
  });

  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchPreviews()
      .then((response) => {
        setPreviews(response.data);
      })
      .catch((error) => {
        console.error('Error fetching previews:', error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Function to handle adding/removing favorites
  const handleFavorite = (showId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(showId);
      if (isFavorite) {
        return prevFavorites.filter((id) => id !== showId); // Remove if already favorite
      } else {
        return [...prevFavorites, showId]; // Add to favorites
      }
    });
  };

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage favorites={favorites} handleFavorite={handleFavorite} />} />
        <Route path="/genre/:id" element={<GenrePage />} />
        <Route path="/show/:id" element={<ShowDetails favorites={favorites} addFavorite={handleFavorite} removeFavorite={handleFavorite} />} />
        <Route path="/season/:id" element={<EpisodePage />} />
        <Route path="/favorites" element={<FavoritesPage favorites={favorites} previews={previews} />} />
      </Routes>
    </div>
  );
};

export default App;
