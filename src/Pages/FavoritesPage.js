import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    TextField,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    sortByTitleAscending,
    sortByTitleDescending,
    sortByDateAscending,
    sortByDateDescending,
} from '../utils/sortUtils';
import PropTypes from 'prop-types';

const FavoritesPage = ({ favoriteEpisodes, toggleFavorite, onBackToShows }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [sortedFavorites, setSortedFavorites] = useState([]);

    useEffect(() => {
        // Filter episodes based on search query
        let filtered = favoriteEpisodes.filter((fav) =>
            fav.showTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fav.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort episodes based on sort option
        let sorted;
        switch (sortOption) {
            case 'A-Z':
                sorted = sortByTitleAscending(filtered, 'showTitle');
                break;
            case 'Z-A':
                sorted = sortByTitleDescending(filtered, 'showTitle');
                break;
            case 'newest':
                sorted = sortByDateDescending(filtered, 'updated');
                break;
            case 'oldest':
                sorted = sortByDateAscending(filtered, 'updated');
                break;
            default:
                sorted = filtered;
        }

        setSortedFavorites(sorted);
    }, [favoriteEpisodes, searchQuery, sortOption]);

    const handleRemoveFavorite = (episode) => {
        toggleFavorite(episode);
    };

    return (
        <Box sx={{ padding: 2, mt: '4rem', mb: '6rem' }}>
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
                    onClick={onBackToShows}
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
                            transform: 'scale(1.05)',
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <Select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
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
                                   <IconButton
    edge="end"
    aria-label="delete"
    onClick={() => handleRemoveFavorite(fav)}
    sx={{
        color: 'red', // Set the color of the button to red
        '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)', // Optional hover effect
        },
    }}
>
    <DeleteIcon />
</IconButton>

                                </Box>
                            </ListItem>
                            {index < sortedFavorites.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

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
    toggleFavorite: PropTypes.func.isRequired,
    onBackToShows: PropTypes.func.isRequired,
};

export default FavoritesPage;
