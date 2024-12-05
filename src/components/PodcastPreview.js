// Importing React library to use JSX syntax and React features
import React from "react";

// Importing useNavigate from react-router-dom for navigation within the app
import { useNavigate } from "react-router-dom";

// Defining the PodcastPreview functional component with props
const PodcastPreview = ({
  show,           // 'show' prop contains the data for the podcast to be displayed
  isFavorite,     // 'isFavorite' prop determines if the podcast is marked as a favorite
  addFavorite,    // 'addFavorite' prop is a function to add a podcast to favorites
  removeFavorite, // 'removeFavorite' prop is a function to remove a podcast from favorites
}) => {
  // Initializing the navigate function from useNavigate hook to programmatically navigate between routes
  const navigate = useNavigate();

  // handleNavigate function to navigate to the detailed page of the podcast when clicked
  const handleNavigate = () => {
    // Navigating to the show detail page using the unique 'id' of the podcast
    navigate(`/show/${show.id}`);
  };

  // handleFavoriteToggle function to toggle the favorite status of the podcast
  const handleFavoriteToggle = () => {
    // If the podcast is already a favorite, remove it from favorites
    if (isFavorite) {
      removeFavorite(show.id);
    } else {
      // Otherwise, add it to favorites
      addFavorite(show.id);
    }
  };

  // JSX to render the podcast preview
  return (
    // Div element representing the podcast preview. The 'onClick' event triggers handleNavigate.
    <div
      className="podcast-preview"
      onClick={handleNavigate} // Trigger navigation to the show detail page when clicked
      style={{ cursor: "pointer" }} // Styling to show a pointer cursor when hovered
    >
      {/* Display the podcast image */}
      <img src={show.image} alt={show.title} className="podcast-image" />
      {/* Display the podcast title */}
      <h3>{show.title}</h3>
    </div>
  );
};

// Exporting the PodcastPreview component to be used elsewhere in the app
export default PodcastPreview;
