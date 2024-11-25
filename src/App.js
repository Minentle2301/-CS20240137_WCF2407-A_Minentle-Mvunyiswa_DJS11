import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import GenrePage from './Pages/GenrePage';
import ShowPage from './Pages/ShowPage';
import EpisodePage from './Pages/EpisodePage';

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/genre/:id" element={<GenrePage />} />
        <Route path="/show/:id" element={<ShowPage />} />
        <Route path="/episode/:id" element={<EpisodePage />} />
      </Routes>
    </div>
  );
};

export default App;

