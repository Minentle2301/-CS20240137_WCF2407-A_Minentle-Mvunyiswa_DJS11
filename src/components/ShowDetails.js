// Import necessary dependencies
import React, { useEffect, useState } from "react"; // React and hooks for managing state and effects
import { useParams, Link, useNavigate } from "react-router-dom"; // For routing and navigation in the app
import axios from "axios"; // Axios for making HTTP requests to fetch data
import PropTypes from "prop-types"; // PropTypes for type checking the component's props
import EpisodePlayer from "./EpisodePlayer"; // A component to handle playing episodes
import PodcastDetailsModal from "./PodcastDetailsModal"; // A modal to show more podcast details
import "./ShowDetails.css"; // Import custom styling for this component

// Define the ShowDetails component
const ShowDetails = ({ favorites, addFavorite, removeFavorite }) => {
    // Get the 'id' from the URL using useParams hook
    const { id } = useParams();
    const navigate = useNavigate(); // useNavigate hook to programmatically navigate

    // State variables for holding various data and UI states
    const [show, setShow] = useState(null); // Stores details of the show
    const [episodes, setEpisodes] = useState([]); // Stores episodes of the selected season
    const [selectedSeason, setSelectedSeason] = useState(1); // Tracks which season is selected
    const [error, setError] = useState(null); // Stores any error messages
    const [modalOpen, setModalOpen] = useState(false); // Controls the modal visibility
    const [genres, setGenres] = useState([]); // Stores the list of genres for the show
    const [favoriteEpisodes, setFavoriteEpisodes] = useState([]); // Stores the list of favorite episodes
    const [listenedEpisodes, setListenedEpisodes] = useState([]); // Stores the list of episodes marked as listened
    const [episodeTimestamps, setEpisodeTimestamps] = useState({}); // Stores the timestamps for each episode

    // useEffect to fetch show data and genres when the component mounts or when 'id' or 'selectedSeason' changes
    useEffect(() => {
        // Function to fetch show data from API
        const fetchShowData = async () => {
            try {
                const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`);
                setShow(response.data); // Set the fetched show data in the state

                // If the show has seasons, set the episodes for the selected season
                if (response.data.seasons?.length > 0) {
                    setEpisodes(response.data.seasons[selectedSeason - 1]?.episodes || []);
                }
            } catch (err) {
                setError("Failed to load show details. Please try again later."); // Handle error by setting an error message
            }
        };

        // Function to fetch genres data from API
        const fetchGenres = async () => {
            try {
                const response = await axios.get('https://podcast-api.netlify.app/genres');
                setGenres(response.data); // Set the fetched genres data in the state
            } catch (err) {
                console.error("Failed to load genres:", err); // Log any errors fetching genres
            }
        };

        fetchShowData(); // Fetch the show data
        fetchGenres(); // Fetch the genres data
    }, [id, selectedSeason]); // Dependency array ensures this effect runs when 'id' or 'selectedSeason' changes

    // Function to handle season change (when a user clicks on a different season button)
    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber); // Set the new selected season
        setEpisodes(show.seasons[seasonNumber - 1]?.episodes || []); // Update the episodes for the selected season
    };

    // Functions to handle opening and closing the podcast details modal
    const handleOpenModal = () => {
        setModalOpen(true); // Open the modal by setting modalOpen to true
    };

    const handleCloseModal = () => {
        setModalOpen(false); // Close the modal by setting modalOpen to false
    };

    // Function to handle playing an episode (currently just logs the episode title)
    const handlePlayEpisode = (episode) => {
        console.log("Playing episode:", episode.title); // Replace with actual episode playing logic
    };

    // Function to toggle favorite status of an episode
    const handleToggleFavorite = (episodeData) => {
        // Create a new episode data object with relevant information
        const newEpisodeData = {
            showId: show.id,
            showTitle: show.title,
            seasonTitle: show.seasons[selectedSeason - 1].title,
            episodeTitle: episodeData.title,
            episodeNumber: episodeData.episode,
            updated: show.updated
        };

        // If the episode is already a favorite, remove it from favorites
        if (isFavorite(newEpisodeData)) {
            setFavoriteEpisodes(favoriteEpisodes.filter(fav =>
                !(fav.showId === newEpisodeData.showId &&
                    fav.episodeTitle === newEpisodeData.episodeTitle &&
                    fav.seasonTitle === newEpisodeData.seasonTitle)
            ));
            removeFavorite(newEpisodeData); // Remove from favorites
        } else {
            // Otherwise, add it to favorites
            setFavoriteEpisodes([...favoriteEpisodes, newEpisodeData]);
            addFavorite(newEpisodeData); // Add to favorites
        }
    };

    // Function to check if an episode is already in the favorites list
    const isFavorite = (episode) => {
        return favoriteEpisodes.some(fav =>
            fav.showId === episode.showId &&
            fav.episodeTitle === episode.episodeTitle &&
            fav.seasonTitle === episode.seasonTitle
        );
    };

    // If there's an error, display the error message
    if (error) {
        return <div>{error}</div>;
    }

    // If show data is still loading, display a loading message
    if (!show) {
        return <div>Loading...</div>;
    }

    return (
        <div className="show-details">
            <img src={show.image} alt={show.title} className="show-image" /> {/* Display show image */}
            <h1>{show.title}</h1> {/* Display show title */}
            <p>{show.description}</p> {/* Display show description */}

            <h2>Seasons</h2>
            <p>Last Updated: {new Date(show.updated).toLocaleDateString()}</p> {/* Display last updated date */}
            <p>Genres: {show.genres?.join(", ") || "N/A"}</p> {/* Display genres */}

            <div className="seasons">
                {show.seasons.map((season, index) => (
                    <button key={index} onClick={() => handleSeasonChange(index + 1)}>
                        Season {index + 1} {/* Button to select a season */}
                    </button>
                ))}
            </div>

            <div>
                <h3>Season {selectedSeason} Episodes</h3>
                <EpisodePlayer
                    episodes={episodes} // Pass episodes to the EpisodePlayer component
                    onFavoriteToggle={handleToggleFavorite} // Pass the toggle favorite function
                    favoriteEpisodes={favoriteEpisodes} // Pass the list of favorite episodes
                />
            </div>

            <button onClick={handleOpenModal}>Show Details</button> {/* Button to open the modal */}

            {/* PodcastDetailsModal component for showing additional podcast details */}
            <PodcastDetailsModal
                show={show} // Pass show details to the modal
                genres={genres} // Pass the list of genres to the modal
                open={modalOpen} // Control modal visibility
                onClose={handleCloseModal} // Function to close the modal
                onPlayEpisode={handlePlayEpisode} // Pass the play episode function
                loading={!show} // Pass loading state
                toggleFavorite={handleToggleFavorite} // Pass the toggle favorite function
                favoriteEpisodes={favoriteEpisodes} // Pass the list of favorite episodes
                listenedEpisodes={listenedEpisodes} // Pass the list of listened episodes
                episodeTimestamps={episodeTimestamps} // Pass the timestamps for episodes
            />

            {/* Link to the favorites page */}
            <Link to="/favorites">
                <button onClick={() => navigate("/favorites")}>
                    View Favorites {/* Button to navigate to the favorites page */}
                </button>
            </Link>
        </div>
    );
};

// PropTypes to validate props passed to the ShowDetails component
ShowDetails.propTypes = {
    favorites: PropTypes.array.isRequired, // Validate that favorites is an array
    addFavorite: PropTypes.func.isRequired, // Validate that addFavorite is a function
    removeFavorite: PropTypes.func.isRequired, // Validate that removeFavorite is a function
};

// Export the ShowDetails component for use in other parts of the app
export default ShowDetails;
