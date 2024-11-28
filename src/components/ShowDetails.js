import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import "./ShowDetails.css";

const AudioPlayer = ({ src }) => {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    return (
        <div className="audio-player">
            <audio ref={audioRef} src={src}></audio>
            <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
        </div>
    );
};

AudioPlayer.propTypes = {
    src: PropTypes.string.isRequired,
};

const EpisodePlayer = ({ episodes }) => {
    if (!episodes || episodes.length === 0) {
        return <div>Loading episodes...</div>;
    }

    return (
        <div>
            {episodes.map((episode) => (
                <div key={episode.id} className="episode">
                    <h4>{episode.title}</h4>
                    <AudioPlayer src={episode.file} />
                </div>
            ))}
        </div>
    );
};

EpisodePlayer.propTypes = {
    episodes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            file: PropTypes.string.isRequired,
        })
    ).isRequired,
};

const ShowDetails = ({ favorites, addFavorite, removeFavorite }) => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchShowData = async () => {
            try {
                const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`);
                setShow(response.data);

                if (response.data.seasons?.length > 0) {
                    setEpisodes(response.data.seasons[selectedSeason - 1]?.episodes || []);
                }
            } catch (err) {
                console.error("Error fetching show details:", err);
                setError("Failed to load show details. Please try again later.");
            }
        };

        fetchShowData();
    }, [id, selectedSeason]);

    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber);
        setEpisodes(show.seasons[seasonNumber - 1]?.episodes || []);
    };

    const isFavorite = favorites.includes(show?.id);

    const handleFavoriteToggle = () => {
        if (isFavorite) {
            removeFavorite(show.id);
        } else {
            addFavorite(show.id);
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
                <EpisodePlayer episodes={episodes} />
            </div>

            <Link to="/favorites">
                <button onClick={handleFavoriteToggle}>
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
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






