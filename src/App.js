import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import GenrePage from './Pages/GenrePage';
import EpisodePage from './Pages/EpisodePage';
import FavoritesPage from './Pages/FavoritesPage';
import ShowDetails from './components/ShowDetails';
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

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <HomePage favorites={favorites} setFavorites={setFavorites} />
          }
        />
        <Route path="/genre/:id" element={<GenrePage />} />
        <Route path="/show/:id" element={<ShowDetails />} />
        <Route path="/season/:id" element={<EpisodePage />} />
        <Route
          path="/favorites"
          element={
            <FavoritesPage favorites={favorites} previews={previews} />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
