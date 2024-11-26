import React, { useEffect, useState } from 'react';
import { fetchPreviews } from '../utils/api';
import PodcastPreview from '../components/PodcastPreview';
import './HomePage.css';

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

const HomePage = () => {
  const [previews, setPreviews] = useState([]);
  const [filteredPreviews, setFilteredPreviews] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    fetchPreviews()
      .then((response) => {
        const sortedShows = response.data.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setPreviews(sortedShows);
        setFilteredPreviews(sortedShows);
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle genre selection change
  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    setSelectedGenre(genreId);
    filterPodcasts(genreId, searchQuery);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterPodcasts(selectedGenre, query);
  };

  // Filter podcasts based on genre and search query
  const filterPodcasts = (genreId, query) => {
    let filtered = previews;

    if (genreId) {
      filtered = filtered.filter((show) =>
        show.genres.includes(parseInt(genreId))
      );
    }

    if (query) {
      filtered = filtered.filter((show) =>
        show.title.toLowerCase().includes(query)
      );
    }

    // Trigger slide-in animation
    setAnimationClass('animate-slide');
    setTimeout(() => setAnimationClass(''), 500); // Remove animation class after animation ends

    setFilteredPreviews(filtered);
  };

  return (
    <div className="home-page">
      <h1>Podcasts</h1>

      {/* Genre Filter Dropdown */}
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

      {/* Search Input */}
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

      {/* Podcast Grid */}
      <div className={`podcast-grid ${animationClass}`}>
        {filteredPreviews.length > 0 ? (
          filteredPreviews.map((show) => (
            <PodcastPreview key={show.id} show={show} />
          ))
        ) : (
          <p>No podcasts found for the selected genre or search query.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;


