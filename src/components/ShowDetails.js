import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import EpisodePlayer from "./EpisodePlayer";
import "./ShowDetails.css";

const ShowDetails = ({ favorites, addFavorite, removeFavorite }) => {
    const { id } = useParams(); // Get the `id` parameter from the URL
    const navigate = useNavigate();
    
    const [show, setShow] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShowData = async () => {
            try {
                const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`);
                setShow(response.data);

                // Set episodes for the first season or the selected season
                if (response.data.seasons?.length > 0) {
                    setEpisodes(response.data.seasons[selectedSeason - 1]?.episodes || []);
                }
            } catch (err) {
                setError("Failed to load show details. Please try again later.");
            }
        };

        fetchShowData();
    }, [id, selectedSeason]);

    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber);
        setEpisodes(show.seasons[seasonNumber - 1]?.episodes || []);
    };

    const handleFavoriteToggle = (episodeId) => {
        const episodeIndex = episodes.findIndex((episode) => episode.id === episodeId);
        if (episodeIndex !== -1) {
            const updatedEpisodes = [...episodes];
            updatedEpisodes[episodeIndex].isFavorite = !updatedEpisodes[episodeIndex].isFavorite;
            setEpisodes(updatedEpisodes);
            if (updatedEpisodes[episodeIndex].isFavorite) {
                addFavorite(episodeId);
            } else {
                removeFavorite(episodeId);
            }
        }
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
                    <button key={index} onClick={() => handleSeasonChange(index + 1)}>
                        Season {index + 1}
                    </button>
                ))}
            </div>

            <div>
                <h3>Season {selectedSeason} Episodes</h3>
                <EpisodePlayer episodes={episodes} onFavoriteToggle={handleFavoriteToggle} />
            </div>

            {/* Add/remove favorite button for the show */}
            <Link to="/favorites">
                <button onClick={() => navigate("/favorites")}>
                    View Favorites
                </button>
            </Link>
        </div>
    );
};

ShowDetails.propTypes = {
    favorites: PropTypes.array.isRequired, // Favorites must be an array
    addFavorite: PropTypes.func.isRequired, // Function to add an episode to favorites
    removeFavorite: PropTypes.func.isRequired, // Function to remove an episode from favorites
};

export default ShowDetails;
