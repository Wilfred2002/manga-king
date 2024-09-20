"use client";  // Ensure this is here

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav'; // Ensure Nav is also a client component
import axios from 'axios';

function MangaDetails() {
  const { id } = useParams();
  const mangaId = Array.isArray(id) ? id[0] : id;
  const [manga, setManga] = useState<any>(null);
  const [coverImage, setCoverImage] = useState<string>(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMangaDetails = async (mangaId: string) => {
    try {
      const url = `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`;
      const response = await axios.get(url);
      const data = response.data;
      if (data.result === 'ok') {
        const cover = extractCoverImage(data.data);
        setCoverImage(cover || '');
        setManga(data.data);
      } else {
        throw new Error(data.errors.map((e: any) => e.detail).join('; '));
      }
    } catch (error: any) {
      setError('Failed to fetch manga details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  function extractCoverImage(manga: any) {
    const coverArt = manga.relationships.find((rel: any) => rel.type === 'cover_art');
    return coverArt ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}.256.jpg` : undefined;
  }

  useEffect(() => {
    if (!mangaId) return;
    fetchMangaDetails(mangaId);
  }, [mangaId]);

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />
      <h1 className="flex justify-center items-center text-2xl">Loading...</h1>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />
      <h1 className="flex justify-center items-center text-2xl">{error}</h1>
    </div>
  );

  if (!manga) return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />
      <h1 className="flex justify-center items-center text-2xl font-bold">No manga found!</h1>
    </div>
  );

  const title = manga.attributes.title.en || 'No title available';
  const description = manga.attributes.description.en || 'No description available';
  const altTitles = manga.attributes.altTitles.map((altTitle: any) =>
    Object.values(altTitle).join(' • ')
  ).join(' • ');
  const status = manga.attributes.status || 'Unknown';
  const demographic = manga.attributes.demographic || 'N/A';
  const year = manga.attributes.year || 'Unknown';
  const lastVolume = manga.attributes.lastVolume || 'Not available';
  const lastChapter = manga.attributes.lastChapter || 'Not available';
  const contentRating = manga.attributes.contentRating || 'Safe';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />
      <div className="container mx-auto max-w-7xl px-4 sm:px-8 md:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image section with responsive width */}
          <div className="md:col-span-1">
            <img
              src={coverImage || 'default-cover.jpg'}
              alt="Cover Image"
              className="w-full h-auto rounded"
            />
          </div>
          {/* Text content section that spans 2 columns on medium screens */}
          <div className="md:col-span-2 flex flex-col">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <div className="h-24 overflow-y-auto p-2">
              <p className="text-gray-700 dark:text-gray-300">
                {altTitles || 'No alternative titles available'}
              </p>
            </div>

            <div className="py-8">
              <ul>
                <li><strong>Origination:</strong> Manhwa</li>
                <li><strong>Demographic:</strong> {demographic}</li>
                <li><strong>Published:</strong> {year}</li>
                <li><strong>Status:</strong> {status}</li>
                <li><strong>Translation:</strong> {contentRating}</li>
                <li><strong>Final Chapter:</strong> Volume {lastVolume}, Chapter {lastChapter}</li>
                <li><strong>Ranked:</strong> Not available</li>
              </ul>
            </div>

            <h2 className="text-xl mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MangaDetails;
