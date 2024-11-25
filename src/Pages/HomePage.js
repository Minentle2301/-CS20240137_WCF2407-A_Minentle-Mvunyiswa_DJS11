import React, { useEffect, useState } from 'react';
import { fetchPreviews } from '../utils/api';
import PodcastPreview from '../components/PodcastPreview';

const HomePage = () => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchPreviews()
      .then((response) => setPreviews(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="home-page">
      <h1>Podcasts</h1>
      <div className="podcast-grid">
        {previews.map((show) => (
          <PodcastPreview key={show.id} show={show} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
