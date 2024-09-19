"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
import Link from 'next/link';

// Component for displaying manga details
function MangaDetails() {
    const { id } = useParams();
    const [manga, setManga] = useState(null);
    const [coverImage, setCoverImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    const fetchMangaDetails = async (mangaId) => {
      try {
        const url = `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.result === 'ok') {
          const cover = extractCoverImage(data.data);
          setCoverImage(cover);
          return data.data;
        } else {
          throw new Error(data.errors.map(e => e.detail).join('; '));
        }
      } catch (error) {
        throw new Error('Failed to fetch manga details: ' + error.message);
      }
    };
  
    function extractCoverImage(manga) {
      const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
      return coverArt ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.256.jpg` : undefined;
    }
  
    useEffect(() => {
      if (!id) return;
      fetchMangaDetails(id)
        .then(data => {
          setManga(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch manga details.');
          setLoading(false);
        });
    }, [id]);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!manga) return <p>No Manga Found.</p>;
  
    // Safe access to nested properties
    const title = manga.attributes.title.en || 'No title available';
    const description = manga.attributes.description.en || 'No description available';
  
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
        <Nav />
        <div className="container mx-auto px-24 py-10">
          {manga && (
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img src={coverImage || 'default-cover.jpg'} alt="Cover Image" className="w-full h-auto" />
              </div>
              <div className="md:w-2/3 md:pl-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="mt-2 text-gray-700">{description}</p>
                {/* Additional manga details like author, chapters etc. */}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export default MangaDetails;
  