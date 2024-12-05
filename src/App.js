// Import React and hooks for managing state, effects, and context
import React, { useState, useEffect, createContext, useContext } from 'react';
// Import routing components from React Router
import { Routes, Route, useNavigate } from 'react-router-dom';
// Import MUI components for styling and theming
import { ThemeProvider, createTheme, CssBaseline, IconButton } from '@mui/material';
// Import MUI icons for light and dark mode toggles
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
// Import application-specific components and pages
import HomePage from './Pages/HomePage';
import GenrePage from './Pages/GenrePage';
import ShowDetails from './components/ShowDetails';
import EpisodePage from './Pages/EpisodePage';
import FavoritesPage from './Pages/FavoritesPage';
// Import API utility to fetch data
import { fetchPreviews } from './utils/api';
// Import CSS for global styles
import './styles.css';

// Create a context for managing the application's theme (light/dark mode)
const ColorModeContext = createContext();

// Custom hook for accessing the color mode context
export const useColorMode = () => useContext(ColorModeContext);

const App = () => {
    // State to manage the current theme mode ('light' or 'dark')
    const [mode, setMode] = useState('light');
    // State to manage the list of favorite shows, persisted in localStorage
    const [favorites, setFavorites] = useState(
        JSON.parse(localStorage.getItem('favorites')) || []
    );
    // State to manage the list of favorite episodes
    const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);
    // State to store data previews fetched from an API
    const [previews, setPreviews] = useState([]);
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Effect to fetch previews from the API when the component mounts
    useEffect(() => {
        fetchPreviews()
            .then((response) => {
                setPreviews(response.data); // Update the state with the fetched data
            })
            .catch((error) => {
                console.error('Error fetching previews:', error); // Log any errors
            });
    }, []); // Dependency array ensures this runs only once

    // Effect to update localStorage whenever the favorites state changes
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]); // Runs when 'favorites' changes

    // Handler to toggle a show's favorite status
    const handleFavorite = (showId) => {
        setFavorites((prevFavorites) => {
            const isFavorite = prevFavorites.includes(showId);
            if (isFavorite) {
                // If already a favorite, remove it
                return prevFavorites.filter((id) => id !== showId);
            } else {
                // Otherwise, add it to the list
                return [...prevFavorites, showId];
            }
        });
    };

    // Handler to toggle an episode's favorite status
    const handleToggleFavorite = (episodeData) => {
        setFavoriteEpisodes((prevFavorites) => {
            const isFavorite = prevFavorites.some((fav) =>
                fav.showId === episodeData.showId &&
                fav.episodeTitle === episodeData.episodeTitle &&
                fav.seasonTitle === episodeData.seasonTitle
            );
            if (isFavorite) {
                // Remove from favorites if already a favorite
                return prevFavorites.filter((fav) =>
                    !(
                        fav.showId === episodeData.showId &&
                        fav.episodeTitle === episodeData.episodeTitle &&
                        fav.seasonTitle === episodeData.seasonTitle
                    )
                );
            } else {
                // Add to favorites if not already added
                const newFavorite = {
                    ...episodeData,
                    savedAt: new Date().toISOString(),
                };
                return [...prevFavorites, newFavorite];
            }
        });
    };

    // Object to manage toggling between light and dark modes
    const colorMode = {
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
    };

    // Create a theme object based on the current mode
    const theme = createTheme({
        palette: {
            mode, // Dynamically set mode ('light' or 'dark')
        },
    });

    return (
        // Provide the color mode context to the component tree
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Apply consistent baseline styles */}
                <div className="app">
                    {/* Button to toggle light/dark mode */}
                    <IconButton
                        sx={{ position: 'fixed', top: 16, right: 16 }}
                        onClick={colorMode.toggleColorMode}
                        color="inherit"
                    >
                        {/* Display appropriate icon based on the mode */}
                        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                    </IconButton>
                    {/* Define application routes */}
                    <Routes>
                        <Route
                            path="/"
                            element={<HomePage favorites={favorites} handleFavorite={handleFavorite} />}
                        />
                        <Route path="/genre/:id" element={<GenrePage />} />
                        <Route
                            path="/show/:id"
                            element={
                                <ShowDetails
                                    favorites={favorites}
                                    addFavorite={handleToggleFavorite}
                                    removeFavorite={handleToggleFavorite}
                                />
                            }
                        />
                        <Route path="/season/:id" element={<EpisodePage />} />
                        <Route
                            path="/favorites"
                            element={
                                <FavoritesPage
                                    favoriteEpisodes={favoriteEpisodes}
                                    toggleFavorite={handleToggleFavorite}
                                    onBackToShows={() => navigate('/')}
                                    searchQuery=""
                                    sortOption="newest"
                                />
                            }
                        />
                    </Routes>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
