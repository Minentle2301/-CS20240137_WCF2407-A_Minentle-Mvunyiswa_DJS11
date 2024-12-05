// Importing necessary hooks and components from React and Material UI
import { useState, useEffect } from 'react'; // React hooks for state and side-effects
import {
    Modal,        // Modal component from Material UI
    Box,          // Box component from Material UI (used for layout)
    Typography,   // Typography component from Material UI for text
    Button,       // Button component from Material UI
    CircularProgress, // Circular progress spinner component from Material UI
    Select,       // Select component from Material UI (used for dropdown)
    MenuItem,     // MenuItem component from Material UI (used in dropdown list)
    List,         // List component from Material UI (used to display list of items)
    ListItem,     // ListItem component from Material UI (used for list items)
    ListItemText, // ListItemText component from Material UI (used for text in list items)
    Chip,         // Chip component from Material UI (used for tags or labels)
} from '@mui/material';

import PropTypes from 'prop-types';  // Importing PropTypes to validate props

// PodcastDetailsModal functional component
const PodcastDetailsModal = ({
  show,               // Details of the podcast show
  genres,             // List of genres the show belongs to
  open,               // Boolean to control the visibility of the modal
  onClose,            // Function to close the modal
  onPlayEpisode,      // Function to handle episode play
  loading,            // Boolean indicating if data is still loading
  toggleFavorite,     // Function to toggle the favorite status of an episode
  favoriteEpisodes,   // List of favorite episodes
  listenedEpisodes,   // List of episodes that have been listened to
  episodeTimestamps   // Timestamps of when episodes were last played
}) => {
  // State to manage the selected season
  const [selectedSeason, setSelectedSeason] = useState(null);

  // Helper function to format time in HH:MM:SS format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Get the number of hours
    const minutes = Math.floor((seconds % 3600) / 60); // Get the remaining minutes
    const remainingSeconds = seconds % 60; // Get the remaining seconds
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // useEffect hook to update selected season when the show data changes
  useEffect(() => {
    if (show && show.seasons && Array.isArray(show.seasons)) {
      setSelectedSeason(show.seasons[0]); // Set the first season as the default
    }
  }, [show]); // This effect depends on 'show' data

  // Handle toggling the favorite status of an episode
  const handleToggleFavorite = (episode) => {
    toggleFavorite({
      showId: show.id,
      showTitle: show.title,
      seasonTitle: selectedSeason.title,
      episodeTitle: episode.title,
      episodeNumber: episode.episode,
      updated: show.updated
    });
  };

  // Check if a specific episode is in the favorites list
  const isFavorite = (episode) => {
    return favoriteEpisodes.some(fav =>
      fav.showId === show.id &&
      fav.episodeTitle === episode.title &&
      fav.seasonTitle === selectedSeason.title
    );
  };

  // Check if a specific episode has been listened to
  const isListened = (episode) => {
    return listenedEpisodes.some(listened =>
      listened.showId === show.id &&
      listened.episodeTitle === episode.title
    );
  };

  // Handle the selection of a different season from the dropdown
  const handleSeasonChange = (event) => {
    const season = show.seasons.find(s => s.season === event.target.value); // Find the selected season by its number
    setSelectedSeason(season); // Update selected season state
  };

  // Filter genres to display only those associated with the current show
  const showGenres = genres.filter(genre =>
    genre.shows.includes(show.id) // Return genres that include the current show ID
  );

  // If no show data is available, return null (or a loading state)
  if (!show) {
    return null; // Or return a loading spinner or placeholder component
  }

  return (
    // Modal component that displays the podcast details
    <Modal
      open={open}        // Modal visibility is controlled by the 'open' prop
      onClose={onClose}  // Close the modal when the 'onClose' function is called
      aria-labelledby="podcast-details-modal" // Accessibility label for modal
      aria-describedby="podcast-details-description" // Accessibility description for modal
    >
      {/* Modal content inside a Box component for layout */}
      <Box sx={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', // Center the modal
        width: '90%', maxWidth: 800, maxHeight: '90vh',
        bgcolor: 'background.paper',
        border: '2px solid #000000', borderRadius: "2%",
        boxShadow: 24, p: 4,
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {loading ? (
          // Display a CircularProgress spinner while data is loading
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          // Render the podcast details once loading is complete
          <>
            <Box sx={{ display: 'flex', mb: 2 }}>
              {/* Left section displaying the season image */}
              <Box sx={{ width: '30%', mr: 2 }}>
                <img
                  src={selectedSeason ? selectedSeason.image : show.image}
                  alt={show.title}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </Box>
              {/* Right section displaying the podcast description and other details */}
              <Box sx={{ width: '70%' }}>
                <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
                  {show.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, maxHeight: '100px', overflow: 'auto' }}>
                  {show.description}
                </Typography>

                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Updated: {(new Date(show.updated)).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour12: false,
                    })}
                  </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}>
                  {Array.isArray(show.seasons) && (
                    <Select
                      value={selectedSeason ? selectedSeason.season : ''}
                      onChange={handleSeasonChange}
                      sx={{ minWidth: 120, mr: 2 }}
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
                      <Typography variant="body1" component="p">
                        Episodes: {selectedSeason.episodes.length}
                      </Typography>
                    ) : (
                      <Typography variant="body1" component="p">
                        No episodes available
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* List of episodes for the selected season */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List>
                {selectedSeason && selectedSeason.episodes.map((episode) => (
                  <ListItem key={episode.episode} divider>
                    <ListItemText
                      primary={`Episode ${episode.episode}: ${episode.title}`}
                      secondary={
                        <>
                          {episode.description}
                          {episodeTimestamps[show.id] && episodeTimestamps[show.id][episode.title] && (
                            <Typography variant="caption" display="block">
                              Last played: {formatTime(episodeTimestamps[show.id][episode.title])}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

// Defining the expected types for each prop
PodcastDetailsModal.propTypes = {
    show: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPlayEpisode: PropTypes.func.isRequired,
    genres: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string
    })).isRequired,
    loading: PropTypes.bool.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    favoriteEpisodes: PropTypes.array.isRequired,
    listenedEpisodes: PropTypes.array.isRequired,
    episodeTimestamps: PropTypes.object.isRequired,
};

export default PodcastDetailsModal;
