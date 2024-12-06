// Importing necessary hooks and components from React and Material-UI for UI design
import { useState, useEffect } from 'react';
import {
    Modal, // A pop-up/modal container
    Box, // A flexible box layout component
    Typography, // For text with various styles
    Button, // Styled button component
    CircularProgress, // For showing a loading spinner
    Select, // Dropdown menu component
    MenuItem, // Items for the dropdown menu
    List, // A list container
    ListItem, // Individual list items
    ListItemText, // Text content for list items
    Chip, // A small, informative badge-like component
} from '@mui/material';

// Importing PropTypes for type-checking props
import PropTypes from 'prop-types';

// Defining the PodcastDetailsModal component
const PodcastDetailsModal = ({
    show, // The podcast show data object
    genres, // List of genres related to the podcast
    open, // Boolean indicating if the modal is open
    onClose, // Function to close the modal
    onPlayEpisode, // Function to play a selected episode
    loading, // Boolean indicating if data is loading
    toggleFavorite, // Function to toggle an episode as favorite
    favoriteEpisodes, // List of favorite episodes
    listenedEpisodes, // List of listened episodes
    episodeTimestamps, // Last played timestamps for episodes
}) => {
    // State to manage the currently selected season
    const [selectedSeason, setSelectedSeason] = useState(null);

    // Helper function to format time from seconds to HH:mm:ss
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Effect hook to initialize the selected season when the show data changes
    useEffect(() => {
        if (show && show.seasons && Array.isArray(show.seasons)) {
            setSelectedSeason(show.seasons[0]); // Select the first season by default
        }
    }, [show]);

    // Handler to toggle an episode as favorite
    const handleToggleFavorite = (episode) => {
        toggleFavorite({
            showId: show.id, // Unique ID of the show
            showTitle: show.title, // Title of the show
            seasonTitle: selectedSeason.title, // Title of the current season
            episodeTitle: episode.title, // Title of the episode
            episodeNumber: episode.episode, // Episode number
            updated: show.updated, // Last updated timestamp of the show
        });
    };

    // Function to check if an episode is a favorite
    const isFavorite = (episode) => {
        return favoriteEpisodes.some(
            (fav) =>
                fav.showId === show.id &&
                fav.episodeTitle === episode.title &&
                fav.seasonTitle === selectedSeason.title
        );
    };

    // Function to check if an episode is listened to
    const isListened = (episode) => {
        return listenedEpisodes.some(
            (listened) =>
                listened.showId === show.id &&
                listened.episodeTitle === episode.title
        );
    };

    // Handler to update the selected season when a new one is chosen from the dropdown
    const handleSeasonChange = (event) => {
        const season = show.seasons.find((s) => s.season === event.target.value);
        setSelectedSeason(season);
    };

    // Filter genres to match the current show
    const showGenres = genres.filter((genre) => genre.shows.includes(show.id));

    // If no show data is available, render nothing
    if (!show) {
        return null;
    }

    // Main render of the modal
    return (
        <Modal
            open={open} // Control the visibility of the modal
            onClose={onClose} // Close modal handler
            aria-labelledby="podcast-details-modal" // Accessibility label for the modal
            aria-describedby="podcast-details-description" // Accessibility description for the modal
        >
            <Box
                sx={{
                    position: 'absolute', // Positioning at the center
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 800,
                    maxHeight: '90vh', // Ensures modal doesn't exceed viewport
                    bgcolor: '#f5f5f5',
                    border: '2px solid #3f51b5',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Show loading spinner if data is still loading */}
                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {/* Podcast Details Header */}
                        <Box sx={{ display: 'flex', mb: 2 }}>
                            {/* Show image */}
                            <Box sx={{ width: '30%', mr: 2 }}>
                                <img
                                    src={selectedSeason ? selectedSeason.image : show.image}
                                    alt={show.title}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                    }}
                                />
                            </Box>
                            {/* Show metadata */}
                            <Box sx={{ width: '70%' }}>
                                <Typography variant="h4" component="h2" sx={{ mb: 1, color: '#3f51b5' }}>
                                    {show.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mb: 2,
                                        maxHeight: '100px',
                                        overflow: 'auto',
                                        color: '#555',
                                    }}
                                >
                                    {show.description}
                                </Typography>
                                {/* Show last update and season dropdown */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ mb: 1, color: '#777' }}
                                    >
                                        Updated:{' '}
                                        {new Date(show.updated).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour12: false,
                                        })}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                                        {Array.isArray(show.seasons) && (
                                            <Select
                                                value={selectedSeason ? selectedSeason.season : ''}
                                                onChange={handleSeasonChange}
                                                sx={{
                                                    minWidth: 120,
                                                    mr: 2,
                                                    bgcolor: '#e0e0e0',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                {show.seasons.map((season) => (
                                                    <MenuItem key={season.season} value={season.season}>
                                                        Season {season.season}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                        <Box>
                                            {Array.isArray(selectedSeason?.episodes) ? (
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    sx={{ color: '#333' }}
                                                >
                                                    Episodes: {selectedSeason.episodes.length}
                                                </Typography>
                                            ) : (
                                                <Typography
                                                    variant="body1"
                                                    component="p"
                                                    sx={{ color: '#333' }}
                                                >
                                                    No episodes available
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        {/* Episode List */}
                        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                            <List>
                                {selectedSeason &&
                                    selectedSeason.episodes.map((episode) => (
                                        <ListItem
                                            key={episode.episode}
                                            divider
                                            sx={{
                                                bgcolor: isListened(episode)
                                                    ? '#e0f7fa'
                                                    : 'white',
                                            }}
                                        >
                                            <ListItemText
                                                primary={`Episode ${episode.episode}: ${episode.title}`}
                                                secondary={
                                                    <>
                                                        {episode.description}
                                                        {episodeTimestamps[show.id] &&
                                                            episodeTimestamps[show.id][episode.title] && (
                                                                <Typography
                                                                    variant="caption"
                                                                    display="block"
                                                                    sx={{ color: '#888' }}
                                                                >
                                                                    Last played:{' '}
                                                                    {formatTime(
                                                                        episodeTimestamps[show.id][episode.title]
                                                                    )}
                                                                </Typography>
                                                            )}
                                                    </>
                                                }
                                            />
                                            {/* Favorite toggle */}
                                          
                                        </ListItem>
                                    ))}
                            </List>
                        </Box>
                        {/* Close Button */}
                        <Button
                            onClick={onClose}
                            sx={{
                                mt: 2,
                                bgcolor: '#3f51b5',
                                color: 'white',
                                '&:hover': { bgcolor: '#303f9f' },
                            }}
                        >
                            Close
                        </Button>
                    </>
                )}
            </Box>
        </Modal>
    );
};

// Prop type definitions for type-checking props
PodcastDetailsModal.propTypes = {
    show: PropTypes.object.isRequired, // Show data object
    open: PropTypes.bool.isRequired, // Boolean for modal visibility
    onClose: PropTypes.func.isRequired, // Function to close the modal
    onPlayEpisode: PropTypes.func.isRequired, // Function to play episodes
    genres: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired, // Genre ID
            title: PropTypes.string.isRequired, // Genre title
            description: PropTypes.string, // Genre description
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired, // Loading state
    toggleFavorite: PropTypes.func.isRequired, // Function to toggle favorites
    favoriteEpisodes: PropTypes.array.isRequired, // List of favorite episodes
    listenedEpisodes: PropTypes.array.isRequired, // List of listened episodes
    episodeTimestamps: PropTypes.object.isRequired, // Episode timestamps
};

// Exporting the component for use in other parts of the application
export default PodcastDetailsModal;
