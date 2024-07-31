import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MangaDetails.css';

const MangaDetails = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);

  useEffect(() => {
    axios.get(`https://api.mangadex.org/manga/${id}`)
      .then(response => {
        setManga(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching manga details:', error);
      });
  }, [id]);

  if (!manga) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manga-details">
      <h1>{manga.attributes.title}</h1>
      <p>{manga.attributes.description}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default MangaDetails;
