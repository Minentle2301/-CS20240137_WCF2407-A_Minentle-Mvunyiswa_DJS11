import React, { useEffect, useState } from 'react';
import { fetchPreviews } from '../utils/api';
import PodcastPreview from '../components/PodcastPreview';
import './HomePage.css';


// Genre Titles Mapping
const genreTitles = {
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
  const [selectedGenre, setSelectedGenre] = useState(''); // State for selected genre

  useEffect(() => {
    fetchPreviews()
      .then((response) => {
        setPreviews(response.data);
        setFilteredPreviews(response.data); // Initially show all podcasts
      })
      .catch((error) => console.error(error));
  }, []);

  // Handle genre selection change
  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    setSelectedGenre(genreId);

    if (genreId === '') {
      // If no genre is selected, show all podcasts
      setFilteredPreviews(previews);
    } else {
      // Filter previews by selected genre
      setFilteredPreviews(previews.filter((show) => show.genre_id === parseInt(genreId)));
    }
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

      {/* Podcast Grid */}
      <div className="podcast-grid">
        {filteredPreviews.length > 0 ? (
          filteredPreviews.map((show) => (
            <PodcastPreview key={show.id} show={show} />
          ))
        ) : (
          <p>No podcasts found for the selected genre.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;

