// EpisodePlayer.js
import React from 'react';

// The EpisodePlayer component receives 'episodes' and 'onFavoriteToggle' as props
const EpisodePlayer = ({ episodes, onFavoriteToggle }) => {
    return (
        <div>
            {/* Map through the list of episodes and render each one */}
            {episodes.map((episode, index) => ( // Add index here
                <div key={index} className="episode"> {/* Use index as key */}
                    <h4>{episode.title}</h4> {/* Display episode title */}

                    <audio controls>
                        <source src={episode.file} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>

                    {/* Button to toggle favorite status */}
                    <button onClick={() => onFavoriteToggle(episode)}>
                        {/* Check if the episode is already a favorite and display the appropriate button text */}
                        {episode.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </button>

                </div>
            ))}
        </div>
    );
};

export default EpisodePlayer;