// Import necessary libraries and hooks from React and React Router
import React, { useEffect, useState } from 'react'; // React for component rendering, useEffect for side effects, and useState for state management
import { useParams } from 'react-router-dom'; // useParams for accessing route parameters

// Import the fetchShow API utility to retrieve podcast details
import { fetchShow } from '../utils/api'; 

// Import the ShowDetails component to display detailed information about a podcast
import ShowDetails from '../components/ShowDetails';

// Define the ShowPage component, responsible for displaying details about a specific podcast
const ShowPage = () => {
  // Extract the `id` parameter from the URL using useParams hook
  const { id } = useParams();

  // State to hold the show details fetched from the API
  const [show, setShow] = useState(null);

  // Effect to fetch podcast details when the component mounts or the `id` changes
  useEffect(() => {
    // Call the API to fetch the show details using the extracted `id`
    fetchShow(id)
      .then((response) => setShow(response.data)) // Store the fetched data in the `show` state
      .catch((error) => console.error(error)); // Log any errors to the console
  }, [id]); // Dependency array ensures this effect runs whenever `id` changes

  // Render the ShowDetails component if the `show` data is available, otherwise display a loading message
  return show ? <ShowDetails show={show} /> : <p>Loading...</p>;
};

// Export the ShowPage component as the default export of this module
export default ShowPage;
