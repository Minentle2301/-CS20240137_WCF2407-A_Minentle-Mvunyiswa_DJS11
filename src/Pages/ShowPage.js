import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShow } from '../utils/api';
import ShowDetails from '../components/ShowDetails';

const ShowPage = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    fetchShow(id)
      .then((response) => setShow(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  return show ? <ShowDetails show={show} /> : <p>Loading...</p>;
};

export default ShowPage;
