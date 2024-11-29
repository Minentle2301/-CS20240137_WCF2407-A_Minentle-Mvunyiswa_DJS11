import React, { useEffect, useState } from 'react'; // Importing React and hooks
import { fetchPreviews } from '../utils/api'; // API utility function to fetch podcast previews
import PodcastPreview from '../components/PodcastPreview'; // Component to display individual podcast preview
import './HomePage.css'; // Styles for the HomePage component

// Genre mapping for filtering podcasts
export const genreTitles = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

const HomePage = ({ favorites, addFavorite, removeFavorite }) => {
  // State to store all podcast previews fetched from the API
  const [previews, setPreviews] = useState([]);

  // State to store filtered podcast previews based on user inputs
  const [filteredPreviews, setFilteredPreviews] = useState([]);

  // State to track the selected genre for filtering
  const [selectedGenre, setSelectedGenre] = useState('');

  // State to track the user's search query
  const [searchQuery, setSearchQuery] = useState('');

  // State to add animation classes for smooth UI transitions
  const [animationClass, setAnimationClass] = useState('');

  // State to manage the sorting order (ascending or descending)
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch podcast previews when the component mounts
  useEffect(() => {
    fetchPreviews()
      .then((response) => {
        // Sort podcasts alphabetically by title (default: ascending)
        const sortedShows = response.data.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setPreviews(sortedShows); // Save fetched and sorted podcasts
        setFilteredPreviews(sortedShows); // Initialize filtered previews with all podcasts
      })
      .catch((error) => console.error(error)); // Handle errors in fetching data
  }, []);

  // Handle changes in the genre filter dropdown
  const handleGenreChange = (event) => {
    const genreId = event.target.value; // Get the selected genre ID
    setSelectedGenre(genreId); // Update the selected genre state
    filterPodcasts(genreId, searchQuery); // Filter podcasts based on genre and search query
  };

  // Handle user input in the search bar
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive matching
    setSearchQuery(query); // Update the search query state
    filterPodcasts(selectedGenre, query); // Filter podcasts based on genre and search query
  };

  // Filter podcasts based on the selected genre and search query
  const filterPodcasts = (genreId, query) => {
    let filtered = previews; // Start with all podcasts

    if (genreId) {
      // Filter by genre if a genre is selected
      filtered = filtered.filter((show) =>
        show.genres.includes(parseInt(genreId))
      );
    }

    if (query) {
      // Filter by search query if input is provided
      filtered = filtered.filter((show) =>
        show.title.toLowerCase().includes(query)
      );
    }

    // Sort podcasts based on the current sorting order
    if (sortOrder === 'asc') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Trigger animation for UI updates
    setAnimationClass('animate-slide');
    setTimeout(() => setAnimationClass(''), 500); // Reset animation class after animation ends

    setFilteredPreviews(filtered); // Update filtered previews with the new filtered list
  };

  // Handle sorting podcasts alphabetically (ascending or descending)
  const handleSort = (order) => {
    setSortOrder(order); // Update sorting order state
    const sorted = [...filteredPreviews].sort((a, b) =>
      order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    setFilteredPreviews(sorted); // Update filtered previews with sorted list
  };

  return (
    <div className="home-page">
      <h1>The Pods Joy</h1>

      {/* Genre filter dropdown */}
      <div className="filter">
        <label htmlFor="genre">Filter by Genre: </label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {Object.entries(genreTitles).map(([id, title]) => (
            <option key={id} value={id}>
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
          onChange={handleSearchChange}
          placeholder="Search podcasts..."
        />
      </div>

      {/* Sorting buttons */}
      <div className="sorting">
        <button
          onClick={() => handleSort('asc')}
          className={sortOrder === 'asc' ? 'active' : ''}
        >
          Sort A-Z
        </button>
        <button
          onClick={() => handleSort('desc')}
          className={sortOrder === 'desc' ? 'active' : ''}
        >
          Sort Z-A
        </button>
      </div>

      {/* Podcast previews grid */}
      <div className={`podcast-grid ${animationClass}`}>
        {filteredPreviews.length > 0 ? (
          filteredPreviews.map((show) => (
            <PodcastPreview
              key={show.id}
              show={show} // Pass podcast details to the preview component
              isFavorite={favorites.includes(show.id)} // Determine if the podcast is in the favorites list
              addFavorite={addFavorite} // Function to add a podcast to favorites
              removeFavorite={removeFavorite} // Function to remove a podcast from favorites
            />
          ))
        ) : (
          <p>Loading...</p> // Display a loading message while data is being fetched
        )}
      </div>
    </div>
  );
};

export default HomePage;



