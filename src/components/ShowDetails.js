// Import React and required hooks for state management and lifecycle methods
import React, { useEffect, useState, useRef } from "react";

// Importing utilities from React Router for routing and navigation
import { useParams, Link } from "react-router-dom";

// Importing Axios for making HTTP requests
import axios from "axios";

// Importing PropTypes for type-checking props
import PropTypes from "prop-types";

// Importing CSS file to style the ShowDetails component
import "./ShowDetails.css";

// AudioPlayer component: Handles the playback of audio files
const AudioPlayer = ({ src }) => {
    // State to track whether audio is playing
    const [playing, setPlaying] = useState(false);
    
    // Reference to the audio element for controlling playback
    const audioRef = useRef(null);

    // Function to toggle play/pause state of the audio
    const togglePlay = () => {
        if (playing) {
            audioRef.current.pause(); // Pause audio if currently playing
        } else {
            audioRef.current.play(); // Play audio if currently paused
        }
        setPlaying(!playing); // Update state to reflect current playback status
    };

    return (
        <div className="audio-player">
            {/* Audio element linked to the provided source */}
            <audio ref={audioRef} src={src}></audio>
            {/* Button to toggle play/pause */}
            <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
        </div>
    );
};

// Type-checking for the AudioPlayer component's props
AudioPlayer.propTypes = {
    src: PropTypes.string.isRequired, // Ensures `src` is a required string
};

// EpisodePlayer component: Displays a list of podcast episodes with playback functionality
const EpisodePlayer = ({ episodes }) => {
    // Handle case where episodes are not yet loaded or empty
    if (!episodes || episodes.length === 0) {
        return <div>Loading episodes...</div>;
    }

    return (
        <div>
            {/* Map through the list of episodes and render each one */}
            {episodes.map((episode) => (
                <div key={episode.id} className="episode">
                    <h4>{episode.title}</h4> {/* Display episode title */}
                    <AudioPlayer src={episode.file} /> {/* Add audio player for the episode */}
                </div>
            ))}
        </div>
    );
};

// Type-checking for the EpisodePlayer component's props
EpisodePlayer.propTypes = {
    episodes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired, // Each episode must have a numeric ID
            title: PropTypes.string.isRequired, // Each episode must have a title
            file: PropTypes.string.isRequired, // Each episode must have a file URL
        })
    ).isRequired,
};

// ShowDetails component: Displays detailed information about a podcast show
const ShowDetails = ({ favorites, addFavorite, removeFavorite }) => {
    // Get the `id` parameter from the URL
    const { id } = useParams();

    // States for managing show data, episodes, selected season, and error messages
    const [show, setShow] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [error, setError] = useState(null);

    // Fetch show details and episodes whenever `id` or `selectedSeason` changes
    useEffect(() => {
        const fetchShowData = async () => {
            try {
                // Make an API call to fetch show details
                const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`);
                setShow(response.data); // Set show data

                // Set episodes for the first season or the selected season
                if (response.data.seasons?.length > 0) {
                    setEpisodes(response.data.seasons[selectedSeason - 1]?.episodes || []);
                }
            } catch (err) {
                console.error("Error fetching show details:", err); // Log errors
                setError("Failed to load show details. Please try again later."); // Display error message
            }
        };

        fetchShowData();
    }, [id, selectedSeason]); // Dependency array ensures this runs when `id` or `selectedSeason` changes

    // Handle season selection and update episodes accordingly
    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber); // Update the selected season
        setEpisodes(show.seasons[seasonNumber - 1]?.episodes || []); // Update episodes for the selected season
    };

    // Determine if the current show is in the list of favorites
    const isFavorite = favorites.includes(show?.id);

    // Toggle the favorite status of the show
    const handleFavoriteToggle = () => {
        if (isFavorite) {
            removeFavorite(show.id); // Remove from favorites if already favorited
        } else {
            addFavorite(show.id); // Add to favorites if not yet favorited
        }
    };

    // Display error message if an error occurred while fetching data
    if (error) {
        return <div>{error}</div>;
    }

    // Display loading message while show data is being fetched
    if (!show) {
        return <div>Loading...</div>;
    }

    return (
        <div className="show-details">
            {/* Display show image */}
            <img src={show.image} alt={show.title} className="show-image" />
            {/* Display show title */}
            <h1>{show.title}</h1>
            {/* Display show description */}
            <p>{show.description}</p>

            {/* Display seasons and genres */}
            <h2>Seasons</h2>
            <p>Last Updated: {new Date(show.updated).toLocaleDateString()}</p>
            <p>Genres: {show.genres?.join(", ") || "N/A"}</p>

            {/* Render buttons for each season */}
            <div className="seasons">
                {show.seasons.map((season, index) => (
                    <button key={index} onClick={() => handleSeasonChange(index + 1)}>
                        Season {index + 1}
                    </button>
                ))}
            </div>

            {/* Display episodes for the selected season */}
            <div>
                <h3>Season {selectedSeason} Episodes</h3>
                <EpisodePlayer episodes={episodes} />
            </div>

            {/* Add/remove favorite button */}
            <Link to="/favorites">
                <button onClick={handleFavoriteToggle}>
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>
            </Link>
        </div>
    );
};

// Type-checking for the ShowDetails component's props
ShowDetails.propTypes = {
    favorites: PropTypes.array.isRequired, // Favorites must be an array
    addFavorite: PropTypes.func.isRequired, // Function to add a show to favorites
    removeFavorite: PropTypes.func.isRequired, // Function to remove a show from favorites
};

// Export the ShowDetails component for use in other parts of the application
export default ShowDetails;







