import React from "react";
import PropTypes from "prop-types";

// EpisodePlayer component: Displays a list of podcast episodes with playback functionality
const EpisodePlayer = ({ episodes, onFavoriteToggle }) => {
    if (!episodes) {
        return <div>Loading episodes...</div>;
    }

    return (
        <div>
            {/* Map through the list of episodes and render each one */}
            {episodes.map((episode) => (
                <div key={episode.id} className="episode">
                    <h4>{episode.title}</h4> {/* Display episode title */}
                    <audio controls>
                        <source src={episode.file} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    {/* Button to toggle favorite status */}
                    <button onClick={() => onFavoriteToggle(episode.id)}>
                        {episode.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </button>
                </div>
            ))}
        </div>
    );
};

EpisodePlayer.propTypes = {
    episodes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired, // Each episode must have a numeric ID
            title: PropTypes.string.isRequired, // Each episode must have a title
            file: PropTypes.string.isRequired, // Each episode must have a file URL
            isFavorite: PropTypes.bool, // Determines if the episode is a favorite
        })
    ).isRequired,
    onFavoriteToggle: PropTypes.func.isRequired, // Function to handle the favorite toggle
};

export default EpisodePlayer;
