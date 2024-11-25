import axios from 'axios';

const API_BASE = 'https://podcast-api.netlify.app';

export const fetchPreviews = async () => axios.get(`${API_BASE}`);
export const fetchGenre = async (genreId) => axios.get(`${API_BASE}/genre/${genreId}`);
export const fetchShow = async (showId) => axios.get(`${API_BASE}/id/${showId}`);
