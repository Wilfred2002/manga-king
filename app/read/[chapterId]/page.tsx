"use client";

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav';
import axios from 'axios';

function ReadChapter() {
  const { chapterId } = useParams();  // Correctly access chapterId
  const [chapterData, setChapterData] = useState(null);
  const [chapterImages, setChapterImages] = useState([]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        // Fetch chapter data
        const response = await axios.get(`https://api.mangadex.org/chapter/${chapterId}`);
        console.log("Full API Response:", response.data); // Log the full response

        const data = response.data?.data; // Ensure the 'data' field exists
        if (!data || !data.attributes) {
          console.log('No chapter attributes found.');
          return;
        }

        // Log the attributes to check what fields are available
        console.log("Chapter Attributes:", data.attributes);

        // Extracting base URL and other details (if available)
        const baseUrl = `https://uploads.mangadex.org`;
        const hash = data.attributes.hash;
        const chapterImageFiles = data.attributes.data;

        // Ensure chapterImageFiles exists before proceeding
        if (!chapterImageFiles) {
          console.log("No images available in this chapter.");
          return;
        }

        // Construct image URLs and set them in state
        const imageUrls = chapterImageFiles.map(file => `${baseUrl}/data/${hash}/${file}`);
        setChapterImages(imageUrls);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    if (chapterId) {
      fetchChapters();
    }
  }, [chapterId]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
      <Nav />

      <div className="py-8 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Chapter {chapterData?.attributes?.chapter}: {chapterData?.attributes?.title || "Loading..."}
        </h1>

        <div className="space-y-4">
          {chapterImages.length > 0 ? (
            chapterImages.map((imgUrl, index) => (
              <img key={index} src={imgUrl} alt={`Page ${index + 1}`} className="w-full" />
            ))
          ) : (
            <p>Loading chapter images or no images available...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReadChapter;
