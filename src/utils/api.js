import axios from 'axios';

const API_BASE = 'https://podcast-api.netlify.app';

// Fetch podcast previews
export const fetchPreviews = async () => axios.get(`${API_BASE}`);

// Fetch genres based on genre ID
export const fetchGenre = async (genreId) => axios.get(`${API_BASE}/genre/${genreId}`);

// Fetch show details based on show ID
export const fetchShow = async (showId) => axios.get(`${API_BASE}/id/${showId}`);

// Fetch episode details based on season ID
export const fetchEpisode = async (seasonId) => axios.get(`${API_BASE}/season/${seasonId}`);
