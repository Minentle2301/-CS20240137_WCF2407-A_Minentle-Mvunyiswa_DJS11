import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGenre } from '../utils/api';
import PodcastPreview from '../components/PodcastPreview';

const GenrePage = () => {
  const { id } = useParams();
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    fetchGenre(id)
      .then((response) => setGenre(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  return genre ? (
    <div className="genre-page">
      <h1>{genre.name}</h1>
      <div className="podcast-grid">
        {genre.shows.map((show) => (
          <PodcastPreview key={show.id} show={show} />
        ))}
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default GenrePage;
