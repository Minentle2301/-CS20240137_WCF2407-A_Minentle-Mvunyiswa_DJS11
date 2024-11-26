import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { genreTitles } from '../Pages/HomePage'; // Import genreTitles

const ShowDetails = () => {
    const { id } = useParams(); // Get the podcast ID from the URL
    const [show, setShow] = useState(null);

    useEffect(() => {
        // Fetch show details using the ID
        axios
            .get(`https://podcast-api.netlify.app/id/${id}`) // Replace with your API endpoint
            .then((response) => setShow(response.data))
            .catch((error) => console.error('Error fetching show details:', error));
    }, [id]);

    if (!show) {
        return <div>Loading...</div>; // Display loading while fetching data
    }

    return (
        <div className="show-details">
            <img src={show.image} alt={show.title} className="show-image" />
            <h1>{show.title}</h1>
            <p>{show.description}</p>
            <p>Last Updated: {new Date(show.updatedAt).toLocaleDateString()}</p>
            <p>Genres: {show.genres.map(genre => genreTitles[genre]).join(', ')}</p> {/* Display genres */}
            <div className="seasons">
                {show.seasons.map((season) => (
                    <Link key={season.id} to={`/season/${season.id}`} className="season-link">
                        Season {season.number} (Episodes: {season.episodes.length}) {/* Display number of episodes */}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ShowDetails;


