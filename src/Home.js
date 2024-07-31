// src/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [mangaList, setMangaList] = useState([]);

  useEffect(() => {
    console.log('Fetching manga list');
    axios.get('https://api.mangadex.org/manga')
      .then(response => {
        console.log('Manga data:', response.data.data);
        setMangaList(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching manga data:', error);
      });
  }, []);

  return (
    <div className="manga-list">
      {mangaList.map(manga => (
        <div key={manga.id} className="manga-card">
          <h2>{manga.attributes.title}</h2>
          <p>{manga.attributes.description}</p>
          <a href={`/manga/${manga.id}`}>Read More</a>
        </div>
      ))}
    </div>
  );
};

export default Home;
