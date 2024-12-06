import React, { useEffect, useState } from "react"; // React and hooks for managing state and effects
import { useParams, Link, useNavigate } from "react-router-dom"; // For routing and navigation in the app
import axios from "axios"; // Axios for making HTTP requests to fetch data
import PropTypes from "prop-types"; // PropTypes for type checking the component's props
import EpisodePlayer from "./EpisodePlayer"; // A component to handle playing episodes
import PodcastDetailsModal from "./PodcastDetailsModal"; // A modal to show more podcast details
import "./ShowDetails.css"; // Import custom styling for this component

// Define the ShowDetails component
const ShowDetails = ({ favorites, addFavorite, removeFavorite }) => {
    const { id } = useParams();
    const navigate = useNavigate(); // useNavigate hook to programmatically navigate

    const [show, setShow] = useState(null); // Stores details of the show
    const [episodes, setEpisodes] = useState([]); // Stores episodes of the selected season
    const [selectedSeason, setSelectedSeason] = useState(1); // Tracks which season is selected
    const [error, setError] = useState(null); // Stores any error messages
    const [modalOpen, setModalOpen] = useState(false); // Controls the modal visibility
    const [genres, setGenres] = useState([]); // Stores the list of genres for the show
    const [favoriteEpisodes, setFavoriteEpisodes] = useState([]); // Stores the list of favorite episodes
    const [listenedEpisodes, setListenedEpisodes] = useState([]); // Stores the list of episodes marked as listened
    const [episodeTimestamps, setEpisodeTimestamps] = useState({}); // Stores the timestamps for each episode

    useEffect(() => {
        const fetchShowData = async () => {
            try {
                const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`);
                setShow(response.data); // Set the fetched show data in the state

                if (response.data.seasons?.length > 0) {
                    setEpisodes(response.data.seasons[selectedSeason - 1]?.episodes || []);
                }
            } catch (err) {
                setError("Failed to load show details. Please try again later."); // Handle error by setting an error message
            }
        };

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

    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber); // Set the new selected season
        setEpisodes(show.seasons[seasonNumber - 1]?.episodes || []); // Update the episodes for the selected season
    };

    const handleOpenModal = () => {
        setModalOpen(true); // Open the modal by setting modalOpen to true
    };

    const handleCloseModal = () => {
        setModalOpen(false); // Close the modal by setting modalOpen to false
    };

    const handlePlayEpisode = (episode) => {
        console.log("Playing episode:", episode.title); // Replace with actual episode playing logic
    };

    const handleToggleFavorite = (episodeData) => {
        const newEpisodeData = {
            showId: show.id,
            showTitle: show.title,
            seasonTitle: show.seasons[selectedSeason - 1].title,
            episodeTitle: episodeData.title,
            episodeNumber: episodeData.episode,
            updated: show.updated
        };

        if (isFavorite(newEpisodeData)) {
            setFavoriteEpisodes(favoriteEpisodes.filter(fav =>
                !(fav.showId === newEpisodeData.showId &&
                    fav.episodeTitle === newEpisodeData.episodeTitle &&
                    fav.seasonTitle === newEpisodeData.seasonTitle)
            ));
            removeFavorite(newEpisodeData); // Remove from favorites
        } else {
            setFavoriteEpisodes([...favoriteEpisodes, newEpisodeData]);
            addFavorite(newEpisodeData); // Add to favorites
        }
    };

    const isFavorite = (episode) => {
        return favoriteEpisodes .some(fav =>
            fav.showId === episode.showId &&
            fav.episodeTitle === episode.episodeTitle &&
            fav.seasonTitle === episode.seasonTitle
        );
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!show) {
        return <div>Loading...</div>;
    }

    return (
        <div className="show-details">
            <img src={show.image} alt={show.title} className="show-image" />
            <h1>{show.title}</h1>
            <p>{show.description}</p>

            <h2>Seasons</h2>
            <p>Last Updated: {new Date(show.updated).toLocaleDateString()}</p>
            <p>Genres: {show.genres?.join(", ") || "N/A"}</p>

            <div className="seasons">
                {show.seasons.map((season, index) => (
                    <button key={index} onClick={() => handleSeasonChange(index + 1)} className="season-button">
                        Season {index + 1}
                    </button>
                ))}
            </div>

            <div>
                <h3>Season {selectedSeason} Episodes</h3>
                <EpisodePlayer
                    episodes={episodes}
                    onFavoriteToggle={handleToggleFavorite}
                    favoriteEpisodes={favoriteEpisodes}
                />
            </div>

            <button onClick={handleOpenModal} className="details-button">Show Details</button>

            <PodcastDetailsModal
                show={show}
                genres={genres}
                open={modalOpen}
                onClose={handleCloseModal}
                onPlayEpisode={handlePlayEpisode}
                loading={!show}
                toggleFavorite={handleToggleFavorite}
                favoriteEpisodes={favoriteEpisodes}
                listenedEpisodes={listenedEpisodes}
                episodeTimestamps={episodeTimestamps}
            />

            <Link to="/favorites">
                <button onClick={() => navigate("/favorites")} className="favorites-button">
                    View Favorites
                </button>
            </Link>
        </div>
    );
};

ShowDetails.propTypes = {
    favorites: PropTypes.array.isRequired,
    addFavorite: PropTypes.func.isRequired,
    removeFavorite: PropTypes.func.isRequired,
};

export default ShowDetails;