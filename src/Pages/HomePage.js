// Importing necessary modules and components
import React, { useEffect, useState } from 'react'; // Import React and hooks (useEffect, useState)
import { fetchPreviews } from '../utils/api'; // Import API utility function to fetch podcast previews
import PodcastPreview from '../components/PodcastPreview'; // Import the component to display individual podcast previews
import './HomePage.css'; // Import styles specific to the HomePage component

// Genre mapping for filtering podcasts
export const genreTitles = {
  1: 'Personal Growth', // Mapping genre ID to genre title
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

// HomePage functional component
const HomePage = ({ favorites, addFavorite, removeFavorite }) => {
  // State hooks to manage various states in the component
  const [previews, setPreviews] = useState([]); // Stores all podcast previews fetched from API
  const [filteredPreviews, setFilteredPreviews] = useState([]); // Stores filtered podcast previews based on genre or search query
  const [selectedGenre, setSelectedGenre] = useState(''); // Tracks the selected genre for filtering
  const [searchQuery, setSearchQuery] = useState(''); // Tracks the user's search query for filtering
  const [animationClass, setAnimationClass] = useState(''); // Tracks animation classes for UI transitions
  const [sortOrder, setSortOrder] = useState('asc'); // Tracks the current sorting order (ascending or descending)

  // useEffect hook to fetch podcast previews when the component mounts
  useEffect(() => {
    fetchPreviews() // Fetch data from the API
      .then((response) => {
        // Sort podcasts alphabetically by title (default to ascending)
        const sortedShows = response.data.sort((a, b) =>
          a.title.localeCompare(b.title) // Compare the titles of two podcasts
        );
        setPreviews(sortedShows); // Save sorted podcasts to state
        setFilteredPreviews(sortedShows); // Initialize filtered podcasts with all podcasts
      })
      .catch((error) => console.error(error)); // Handle any errors that occur during the fetch
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // Function to handle genre change from the dropdown
  const handleGenreChange = (event) => {
    const genreId = event.target.value; // Get the selected genre ID
    setSelectedGenre(genreId); // Update the selected genre state
    filterPodcasts(genreId, searchQuery); // Filter podcasts based on selected genre and search query
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase(); // Convert search input to lowercase for case-insensitive comparison
    setSearchQuery(query); // Update the search query state
    filterPodcasts(selectedGenre, query); // Filter podcasts based on selected genre and search query
  };

  // Function to filter podcasts based on genre and search query
  const filterPodcasts = (genreId, query) => {
    let filtered = previews; // Start with all podcasts

    if (genreId) {
      // If a genre is selected, filter podcasts by genre
      filtered = filtered.filter((show) =>
        show.genres.includes(parseInt(genreId)) // Check if the podcast's genres include the selected genre ID
      );
    }

    if (query) {
      // If a search query is provided, filter podcasts by title
      filtered = filtered.filter((show) =>
        show.title.toLowerCase().includes(query) // Check if the podcast title includes the query
      );
    }

    // Sort podcasts based on the selected sort order (ascending or descending)
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title)); // Sort in ascending order by title
    } else {
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title)); // Sort in descending order by title
    }

    // Trigger animation for smooth UI transition
    setAnimationClass('animate-slide'); // Add animation class to the grid
    setTimeout(() => setAnimationClass(''), 500); // Remove animation class after 500ms (animation duration)

    setFilteredPreviews(filtered); // Update the filtered previews state with the new filtered list
  };

  // Function to handle sorting of podcasts by title (ascending or descending)
  const handleSort = (order) => {
    setSortOrder(order); // Update the sorting order state
    const sorted = [...filteredPreviews].sort((a, b) =>
      order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title) // Sort alphabetically based on selected order
    );
    setFilteredPreviews(sorted); // Update the filtered previews state with the sorted list
  };

  return (
    <div className="home-page"> {/* Main container for the HomePage component */}
      <h1>The Pods Joy</h1> {/* Heading for the HomePage */}

      {/* Genre filter dropdown */}
      <div className="filter">
        <label htmlFor="genre">Filter by Genre: </label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option> {/* Default option to show all genres */}
          {Object.entries(genreTitles).map(([id, title]) => (
            <option key={id} value={id}> {/* Map each genre ID to a dropdown option */}
              {title}
            </option>
          ))}
        </select>
      </div>

      {/* Search input field */}
      <div className="search">
        <label htmlFor="search">Search: </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={handleSearchChange} // Update the search query on user input
          placeholder="Search podcasts..."
        />
      </div>

      {/* Sorting buttons */}
      <div className="sorting">
        <button
          onClick={() => handleSort('asc')}
          className={sortOrder === 'asc' ? 'active' : ''} // Highlight active sort order
        >
          Sort A-Z
        </button>
        <button
          onClick={() => handleSort('desc')}
          className={sortOrder === 'desc' ? 'active' : ''} // Highlight active sort order
        >
          Sort Z-A
        </button>
      </div>

      {/* Podcast previews grid */}
      <div className={`podcast-grid ${animationClass}`}> {/* Add animation class to the grid */}
        {filteredPreviews.length > 0 ? (
          filteredPreviews.map((show) => (
            <PodcastPreview
              key={show.id}
              show={show} // Pass podcast details to the preview component
              isFavorite={favorites.includes(show.id)} // Check if the podcast is in the favorites list
              addFavorite={addFavorite} // Pass function to add to favorites
              removeFavorite={removeFavorite} // Pass function to remove from favorites
            />
          ))
        ) : (
          <p>Loading...</p> // Display loading message while data is being fetched
        )}
      </div>
    </div>
  );
};

export default HomePage; // Export the HomePage component to use it in other parts of the app
