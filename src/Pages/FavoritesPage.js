// Import necessary modules from React and Material UI
import React, { useEffect, useState } from 'react'; // Import React, useState, and useEffect hooks
import {
    Box, // Box component for layout and styling
    Typography, // Typography for text styling
    Button, // Button component
    IconButton, // IconButton for clickable icons
    List, // List component to display a list of items
    ListItem, // ListItem to define individual items in the list
    ListItemText, // ListItemText to display text inside ListItem
    Divider, // Divider to separate list items
    TextField, // TextField for input (search bar)
    Select, // Select component for dropdown
    MenuItem, // MenuItem for options in the Select dropdown
} from '@mui/material'; // Import Material UI components

import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import {
    sortByTitleAscending, // Function to sort items by title in ascending order
    sortByTitleDescending, // Function to sort items by title in descending order
    sortByDateAscending, // Function to sort items by date in ascending order
    sortByDateDescending, // Function to sort items by date in descending order
} from '../utils/sortUtils'; // Import sorting utility functions

import PropTypes from 'prop-types'; // Import PropTypes to validate component props

// FavoritesPage component to display a list of favorite episodes
const FavoritesPage = ({ favoriteEpisodes, toggleFavorite, onBackToShows }) => {
    // State variables for managing the search query, sorting option, and sorted favorites
    const [searchQuery, setSearchQuery] = useState(''); // State for search input
    const [sortOption, setSortOption] = useState('newest'); // State for sorting option (newest, A-Z, etc.)
    const [sortedFavorites, setSortedFavorites] = useState([]); // State to store the sorted list of favorite episodes

    // useEffect hook to handle filtering and sorting when favoriteEpisodes, searchQuery, or sortOption change
    useEffect(() => {
        // Filter the favorite episodes based on the search query
        let filtered = favoriteEpisodes.filter((fav) =>
            fav.showTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fav.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sorting the filtered episodes based on the selected sortOption
        let sorted;
        switch (sortOption) {
            case 'A-Z':
                sorted = sortByTitleAscending(filtered, 'showTitle'); // Sort by title ascending
                break;
            case 'Z-A':
                sorted = sortByTitleDescending(filtered, 'showTitle'); // Sort by title descending
                break;
            case 'newest':
                sorted = sortByDateDescending(filtered, 'updated'); // Sort by newest (based on updated date)
                break;
            case 'oldest':
                sorted = sortByDateAscending(filtered, 'updated'); // Sort by oldest (based on updated date)
                break;
            default:
                sorted = filtered; // Default: no sorting
        }

        setSortedFavorites(sorted); // Set the sorted favorites in the state
    }, [favoriteEpisodes, searchQuery, sortOption]); // Dependency array ensures effect runs when any of these variables change

    // Function to handle removing an episode from favorites
    const handleRemoveFavorite = (episode) => {
        toggleFavorite(episode); // Call toggleFavorite function passed as prop to remove the episode
    };

    // Render the FavoritesPage component
    return (
        <Box sx={{ padding: 2, mt: '4rem', mb: '6rem' }}>
            {/* Header and Back to Shows button */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Your Favorite Episodes
                </Typography>
                <Button
                    variant="outlined"
                    onClick={onBackToShows} // Navigate back to shows page
                    sx={{
                        background: 'linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #2575fc 30%, #6a11cb 90%)',
                            transform: 'scale(1.05)', // Hover effect to scale button
                        },
                    }}
                >
                    Back to Shows
                </Button>
            </Box>

            {/* Search and Sort Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
                    sx={{ flex: 1 }}
                />
                <Select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)} // Update sortOption state on selection change
                    variant="outlined"
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="newest">Newest First</MenuItem>
                    <MenuItem value="oldest">Oldest First</MenuItem>
                    <MenuItem value="A-Z">A-Z</MenuItem>
                    <MenuItem value="Z-A">Z-A</MenuItem>
                </Select>
            </Box>

            {/* Conditional Rendering for No Episodes */}
            {sortedFavorites.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh',
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h6" color="textSecondary">
                        NO EPISODES ADDED YET
                    </Typography>
                </Box>
            ) : (
                <List>
                    {/* Map through sortedFavorites to display each episode */}
                    {sortedFavorites.map((fav, index) => (
                        <React.Fragment key={`${fav.showId}-${fav.episodeTitle}`}>
                            <ListItem>
                                <ListItemText
                                    primary={fav.showTitle}
                                    secondary={`${fav.seasonTitle} - Episode ${fav.episodeNumber} - ${fav.episodeTitle}`}
                                />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textAlign: 'end',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <ListItemText
                                        secondary={
                                            'Added: ' +
                                            new Date(fav.savedAt).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })
                                        }
                                    />
                                    <ListItemText
                                        secondary={
                                            'Updated: ' +
                                            new Date(fav.updated).toLocaleString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })
                                        }
                                    />
                                   {/* Delete icon button to remove the episode from favorites */}
                                   <IconButton
                                       edge="end"
                                       aria-label="delete"
                                       onClick={() => handleRemoveFavorite(fav)}
                                       sx={{
                                           color: 'red',
                                           '&:hover': {
                                               backgroundColor: 'rgba(255, 0, 0, 0.1)', // Optional hover effect
                                           },
                                       }}
                                   >
                                       <DeleteIcon />
                                   </IconButton>
                                </Box>
                            </ListItem>
                            {index < sortedFavorites.length - 1 && <Divider />} {/* Divider between list items */}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

// Prop types validation for the FavoritesPage component
FavoritesPage.propTypes = {
    favoriteEpisodes: PropTypes.arrayOf(
        PropTypes.shape({
            showId: PropTypes.string.isRequired,
            showTitle: PropTypes.string.isRequired,
            seasonTitle: PropTypes.string.isRequired,
            episodeTitle: PropTypes.string.isRequired,
            episodeNumber: PropTypes.number.isRequired,
            savedAt: PropTypes.string.isRequired,
            updated: PropTypes.string.isRequired,
        })
    ).isRequired,
    toggleFavorite: PropTypes.func.isRequired, // Function to toggle favorite status
    onBackToShows: PropTypes.func.isRequired, // Function to navigate back to the shows page
};

// Export the component
export default FavoritesPage;
