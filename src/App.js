import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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

    const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
    const [previews, setPreviews] = useState([]);
    const navigate = useNavigate();

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

    const handleFavorite = (showId) => {
        setFavorites((prevFavorites) => {
            const isFavorite = prevFavorites.includes(showId); 
            if (isFavorite) {
                return prevFavorites.filter((id) => id !== showId);
            } else {
                return [...prevFavorites, showId];
            }
        });
    };

    const handleToggleFavorite = (episodeData) => {
        setFavoriteEpisodes((prevFavorites) => {
            const isFavorite = prevFavorites.some(fav => 
                fav.showId === episodeData.showId && 
                fav.episodeTitle === episodeData.episodeTitle && 
                fav.seasonTitle === episodeData.seasonTitle
            );
            if (isFavorite) {
                return prevFavorites.filter(fav => 
                    !(fav.showId === episodeData.showId && 
                      fav.episodeTitle === episodeData.episodeTitle && 
                      fav.seasonTitle === episodeData.seasonTitle)
                );
            } else {
                const newFavorite = {
                    ...episodeData,
                    savedAt: new Date().toISOString()
                };
                return [...prevFavorites, newFavorite];
            }
        });
    };

    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<HomePage favorites={favorites} handleFavorite={handleFavorite} />} />
                <Route path="/genre/:id" element={<GenrePage />} />
                <Route path="/show/:id" element={<ShowDetails favorites={favorites} addFavorite={handleToggleFavorite} removeFavorite={handleToggleFavorite} />} />
                <Route path="/season/:id" element={<EpisodePage />} />
                <Route path="/favorites" element={<FavoritesPage favoriteEpisodes={favoriteEpisodes} toggleFavorite={handleToggleFavorite} onBackToShows={() => navigate('/')} searchQuery="" sortOption="newest" />} />
            </Routes>
        </div>
    );
};

export default App;