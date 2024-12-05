import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import EpisodePlayer from "./EpisodePlayer";
import PodcastDetailsModal from "./PodcastDetailsModal"; 
import "./ShowDetails.css";

const ShowDetails = ({ favorites, addFavorite, removeFavorite }) => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [show, setShow] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = 
    useState(false); 
    const [genres, setGenres] = useState([]); 
    const [favoriteEpisodes, setFavoriteEpisodes] = useState([]); 
    const [listenedEpisodes, setListenedEpisodes] = useState([]);
    const [episodeTimestamps, setEpisodeTimestamps] = useState({}); 

    useEffect(() => {
        const fetchShowData = async () => {
            try {
                const response = await axios.get(`https://podcast-api.netlify.app/id/${id}`);
                setShow(response.data);

                if (response.data.seasons?.length > 0) {
                    setEpisodes(response.data.seasons[selectedSeason - 1]?.episodes || []);
                }
            } catch (err) {
                setError("Failed to load show details. Please try again later.");
            }
        };

        const fetchGenres = async () => {
            try {
                const response = await axios.get('https://podcast-api.netlify.app/genres');
                setGenres(response.data);
            } catch (err) {
                console.error("Failed to load genres:", err); 
            }
        };

        fetchShowData();
        fetchGenres(); 
    }, [id, selectedSeason]);

    const handleSeasonChange = (seasonNumber) => {
        setSelectedSeason(seasonNumber);
        setEpisodes(show?.seasons[seasonNumber - 1]?.episodes || []);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handlePlayEpisode = (episode) => {
        console.log("Playing episode:", episode.title);
    };

    const handleToggleFavorite = (episodeData) => {
        if (isFavorite(episodeData)) {
            setFavoriteEpisodes(favoriteEpisodes.filter(fav => 
                !(fav.showId === episodeData.showId && 
                  fav.episodeTitle === episodeData.episodeTitle && 
                  fav.seasonTitle === episodeData.seasonTitle)
            ));
            removeFavorite({ 
                showId: episodeData.showId,
                episodeTitle: episodeData.episodeTitle,
                seasonTitle: episodeData.seasonTitle
            });
        } else {
            setFavoriteEpisodes([...favoriteEpisodes, episodeData]);
            addFavorite({
                showId: episodeData.showId,
                episodeTitle: episodeData.episodeTitle,
                seasonTitle: episodeData.seasonTitle
            });
        }
    };

    const isFavorite = (episode) => {
        return favoriteEpisodes.some(fav => 
            fav.showId === show?.id && 
            fav.episodeTitle === episode.title && 
            fav.seasonTitle === show?.seasons[selectedSeason - 1]?.title 
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
                    <button key={index} onClick={() => handleSeasonChange(index + 1)}>  
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

            <button onClick={handleOpenModal}>Show Details</button> 

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
                <button onClick={() => navigate("/favorites")}>
                    View Favorites
                </button>
            </Link>
        </div>
    );
};

ShowDetails.propTypes = {
    favorites: PropTypes.array.isRequired, 
    addFavorite: PropTypes.func.isRequired, 
    removeFavorite: PropTypes.func 
.isRequired,
};

export default ShowDetails;