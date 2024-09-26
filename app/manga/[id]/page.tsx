"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Nav from "@/components/Nav";
import axios from "axios";

// Interfaces for the manga and related data
interface MangaAttributes {
  title: {
    en?: string;
    "ja-ro"?: string;
  };
  description: {
    en: string;
  };
  status: string;
  year?: number;
  publicationDemographic?: string;
}

interface MangaRelationship {
  id: string;
  type: string;
  attributes?: {
    name?: string;
    fileName?: string;
  };
}

interface Manga {
  id: string;
  type: string;
  attributes: MangaAttributes;
  relationships: MangaRelationship[];
}

interface ChapterAttributes {
  chapter?: string;
  title?: string;
  translatedLanguage?: string;
  createdAt: string;
}

interface Chapter {
  id: string;
  attributes: ChapterAttributes;
}

interface Author {
  id: string;
  attributes: {
    name: string;
  };
}

function MangaDetails() {
  const { id } = useParams();
  const [mangaType, setMangaType] = useState<string | null>(null);
  const [manga, setManga] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [coverArt, setCoverArt] = useState<string | null>(null);
  const [mangaStatus, setMangaStatus] = useState<string | null>(null);
  const [mangaDemographic, setMangaDemographic] = useState<string | null>(null);
  const [mangaDescription, setMangaDescription] = useState<string | null>(null);
  const [mangaArtists, setMangaArtist] = useState<string | null>(null);
  const [mangaRating, setMangaRating] = useState<null | number>(null);
  const [mangaPublished, setMangaPublished] = useState<number | null>(null);
  const [mangaChapters, setMangaChapters] = useState<Chapter[]>([]);

  const getCoverUrl = (manga: Manga): string | null => {
    const coverRelation = manga.relationships.find(
      (rel) => rel.type === "cover_art"
    );
    if (
      coverRelation &&
      coverRelation.attributes &&
      coverRelation.attributes.fileName
    ) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverRelation.attributes.fileName}.512.jpg`;
    }
    return null;
  };

  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fetchData() {
    try {
      const response = await axios.get(
        `https://api.mangadex.org/manga/${id}?includes%5B%5D=cover_art&includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag&includes%5B%5D=creator`
      );
      console.log(response.data); //logging json file

      const coverPic = getCoverUrl(response.data.data as Manga);
      setCoverArt(coverPic);

      let title = response.data.data.attributes.title.en;
      if (!title) {
        title = response.data.data.attributes.title["ja-ro"];
        setManga(title);
      }
      setManga(title); //if there is no english language title fall back and use japanese title for main title

      const type = response.data.data.type;
      setMangaType(type); //setting type aka manga/manwha

      const authorID = response.data.data.relationships[0].id;

      if (authorID) {
        const response2 = await axios.get(
          `https://api.mangadex.org/author/${authorID}`
        ); //second API call for author's name
        console.log(response2.data);

        const authorName = response2.data.data.attributes.name; //setting the name
        setAuthor(authorName);
      } else {
        console.error("No author found");
      }

      const status = response.data.data.attributes.status;
      setMangaStatus(status); //getting status of manga

      const demographic = response.data.data.attributes.publicationDemographic;
      setMangaDemographic(demographic); //grabbing description of manga

      const descript = response.data.data.attributes.description.en;
      const trimmedDescription = descript.split("---")[0].trim();
      setMangaDescription(trimmedDescription); // grabbing english description

      const artist = response.data.data.relationships[1].attributes.name;
      setMangaArtist(artist);

      const year = response.data.data.attributes.year;
      setMangaPublished(year);

      setMangaRating(10);

      const allChapters: Chapter[] = []; // Initialize with correct type
      const fetchAllChapters = async (id: string) => {
        let offset = 0;
        const limit = 100; // Set a reasonable limit for each request
        let hasMore = true;

        while (hasMore) {
          const response = await axios.get(
            `https://api.mangadex.org/chapter?manga=${id}&limit=${limit}&offset=${offset}`
          );
          const chaptersData = response.data;
          console.log(chaptersData.data);

          // Loop through all chapters and manually add only English ones
          for (const chapter of chaptersData.data) {
            if (chapter.attributes.translatedLanguage === "en") {
              allChapters.push(chapter); // Only add if it's in English
            }
          }
          console.log(allChapters);

          if (chaptersData.data.length < limit) {
            hasMore = false;
          } else {
            await delay(1000);
            offset += limit;
          }
        }
        return allChapters;
      };

      const chaptersResponse = await fetchAllChapters(id);
      console.log(chaptersResponse);
      setMangaChapters(allChapters);
    } catch (error) {
      console.error("error:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
      <Nav />
      <div className="flex flex-col md:flex-row py-8 max-w-screen-xl mx-auto">
        <div className="w-1/3">
          <div>
            {coverArt ? (
              <img src={coverArt} alt="manga cover" />
            ) : (
              <p>No cover art available</p>
            )}
          </div>
        </div>
        <div className="w-2/3 px-6">
          <h1 className="text-4xl font-bold">
            {manga ? manga : "Loading title..."}
          </h1>
          <div className="border-t border-gray-600 my-4"></div>
          <div>
            <span className="text-gray-400">Origination: </span>
            <span>{mangaType ? mangaType : "Loading type..."}</span>
          </div>
          <div>
            <span className="text-gray-400">Demographic: </span>
            <span>{mangaDemographic ? mangaDemographic : ""}</span>
          </div>
          <div>
            <span className="text-gray-400">Published: </span>
            <span>{mangaPublished ? mangaPublished : "Loading year..."}</span>
          </div>
          <div>
            <span className="text-gray-400">Status: </span>
            <span>{mangaStatus ? mangaStatus : "Loading manga status..."}</span>
          </div>
          <div>
            <span className="text-gray-400">Rating: </span>
            <span>{mangaRating ? mangaRating : "Loading rating..."}</span>
          </div>

          <h1 className="text-2xl py-3 font-bold">Description</h1>
          <p>{mangaDescription ? mangaDescription : "Loading description..."}</p>
          <div className="py-6">
            <Button className="py-">Read Ch.1</Button>
          </div>
          <div className="border-t border-gray-600 my-4"></div>

          <h1 className="text-2xl py-3 font-bold">More Info</h1>

          <div>
            <span className="text-gray-400">Artist: </span>
            <span>{mangaArtists ? mangaArtists : "Loading manga artists..."}</span>
          </div>

          <div>
            <span className="text-gray-400">Author: </span>
            <span>{author ? author : "Loading author..."}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col py-16 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold px-6">Chapters List</h1>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Chapter</TableHead>
              <TableHead className="w-[150px]">Uploaded</TableHead>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead className="text-right w-[120px]">Read</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mangaChapters &&
              mangaChapters.map((chapter) => {
                return (
                  <TableRow key={chapter.id}>
                    <TableCell className="text-center">
                      {chapter.attributes.chapter || "N/A"}
                    </TableCell>
                    <TableCell>
                      {chapter.attributes.createdAt
                        ? new Date(chapter.attributes.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{chapter.attributes.title || ""}</TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`/manga/${id}/${chapter.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Read Chapter
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MangaDetails;
