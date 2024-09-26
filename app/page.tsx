"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";

const API_BASE_URL = "https://api.mangadex.org";

// TypeScript interfaces for data structures
interface MangaAttributes {
  title: {
    en?: string;
    "ja-ro"?: string;
  };
  description?: {
    en?: string;
  };
}

interface MangaRelationship {
  id: string;
  type: string;
  attributes?: {
    fileName?: string;
  };
}

interface Manga {
  id: string;
  attributes: MangaAttributes;
  relationships: MangaRelationship[];
}

export default function Home() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/manga?limit=10&order[followedCount]=desc&includes[]=cover_art`);
        const data = await response.json();
        setMangaList(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching manga:", error);
        setLoading(false);
      }
    };

    fetchManga();
  }, []);

  const getCoverUrl = (manga: Manga): string | null => {
    const coverRelation = manga.relationships.find((rel) => rel.type === "cover_art");
    if (coverRelation && coverRelation.attributes && coverRelation.attributes.fileName) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverRelation.attributes.fileName}.256.jpg`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />

      <section className="relative py-48 flex flex-col">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/bgvidmk.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>

        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 p-24 text-center text-white">
          <h1 className="text-2xl">Welcome to the homepage of Manga King!</h1>
          <h2>Here you can find and read all of your favorite mangas and read new releases!</h2>
        </div>
      </section>

      <section className="p-12">
        <h3 className="text-2xl text-center mb-8">Top 10 Manga</h3>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mangaList.map((manga) => (
              <Link href={`/manga/${manga.id}`}>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer">
                  {getCoverUrl(manga) ? (
                    <img
                    src={getCoverUrl(manga) || undefined}  // Fallback to undefined if null
                    alt={`${manga.attributes.title.en || "Untitled"} Cover`}
                      width={256}
                      height={384}
                      className="w-full h-auto rounded"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded">
                      <span className="text-gray-500">Image not loaded</span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold mt-4">{manga.attributes.title.en || "Untitled"}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {manga.attributes.description?.en?.substring(0, 100) + "..." || "No description available."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
