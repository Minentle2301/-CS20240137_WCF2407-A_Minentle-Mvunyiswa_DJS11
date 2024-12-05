// Importing React to create the component and use JSX syntax
import React from 'react';

// The EpisodePlayer component is a functional component that receives 'episodes' and 'onFavoriteToggle' as props
const EpisodePlayer = ({ episodes, onFavoriteToggle }) => {
    return (
        // The parent div that wraps the entire list of episodes
        <div>
            {/* Map through the list of episodes and render each one */}
            {episodes.map((episode, index) => (  // Iterating over the 'episodes' array using map()
                // Rendering a div for each episode, using the index as the unique key for each episode
                <div key={index} className="episode">  {/* Each episode gets a unique 'key' based on the index */}
                    {/* Display the title of the episode */}
                    <h4>{episode.title}</h4>  {/* This shows the title of the episode */}

                    {/* The audio player element, which lets the user play the episode */}
                    <audio controls>  
                        {/* The source element defines the path to the audio file */}
                        <source src={episode.file} type="audio/mpeg" />
                        {/* If the browser doesn't support the audio element, this message is shown */}
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

// Exporting the EpisodePlayer component to be used in other parts of the application
export default EpisodePlayer;
