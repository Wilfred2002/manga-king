"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Interfaces for the manga and related data
interface ChapterAttributes {
  volume?: string;
  chapter?: string;
  title?: string;
  translatedLanguage?: string;
  externalUrl?: string | null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
}

interface Chapter {
  id: string;
  type: string;
  attributes: ChapterAttributes;
}

interface MangaDetailsProps {
  chapters: Chapter[];
  mangaId: string; 
}

const LIMIT = 100; // Number of chapters to show per page

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function MangaDetails({
  chapters = [], 
  mangaId,
}: MangaDetailsProps) {
  const [allChapters, setAllChapters] = useState<Chapter[]>(chapters);
  const [paginatedChapters, setPaginatedChapters] = useState<Chapter[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // State to manage sorting order

  // Fetch all chapters once when component mounts
  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      let offset = 0;
      const limit = 100; // Maximum allowed by API
      let allChapters: Chapter[] = [];
      let hasMore = true;

      let count = 0;
      while (hasMore) {
        if(count == 0){
          await wait(1000);
        } else{
          wait(300);
        }
        const res = await fetch(
          `https://api.mangadex.org/manga/${mangaId}/feed?limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&translatedLanguage[]=en&includeFutureUpdates=1&order[createdAt]=asc`);  
        const data = await res.json();

        allChapters = [...allChapters, ...data.data]; // Collect chapters

        hasMore = data.total > allChapters.length;
        offset += limit;
        count++;
      }

      setAllChapters(allChapters);
      setTotal(allChapters.length);
      setLoading(false);
    };

    fetchChapters();
  }, [mangaId]);

  // Paginate chapters when page or sorting order changes
  useEffect(() => {
    const startIndex = (page - 1) * LIMIT;
    const endIndex = startIndex + LIMIT;

    const sortedChapters = allChapters.sort((a: Chapter, b: Chapter) => {
      const chapterA = parseFloat(a.attributes?.chapter ?? "0");  // Fallback if undefined
      const chapterB = parseFloat(b.attributes?.chapter ?? "0");

      // If both chapters are numeric, sort numerically
      if (!isNaN(chapterA) && !isNaN(chapterB)) {
        return sortOrder === 'asc' ? chapterA - chapterB : chapterB - chapterA;
      }

      // If one is numeric and the other is not, numeric chapters go first
      if (!isNaN(chapterA)) return sortOrder === 'asc' ? -1 : 1;
      if (!isNaN(chapterB)) return sortOrder === 'asc' ? 1 : -1;

      // If both are non-numeric, sort alphabetically
      const titleA = a.attributes?.chapter || "";
      const titleB = b.attributes?.chapter || "";
      return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });

    setPaginatedChapters(sortedChapters.slice(startIndex, endIndex));
  }, [allChapters, page, sortOrder]);

  // Calculate total number of pages
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="flex flex-col py-8 max-w-screen-xl mx-auto">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Sort Dropdown */}
          <div className="mb-4">
            <label htmlFor="sortOrder" className="mr-2">Sort by:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

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
              {paginatedChapters.length > 0 ? (
                paginatedChapters.map((chapter) => (
                  <TableRow key={chapter.id}>
                    <TableCell className="text-center">
                      {chapter.attributes?.chapter || "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(chapter.attributes?.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{chapter.attributes?.title || "Untitled"}</TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`/manga/${mangaId}/${chapter.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Read Chapter
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No chapters available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center py-4">
            <button
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages} (Showing {Math.min(LIMIT, total - (page - 1) * LIMIT)} of {total} total items)
            </span>
            <button
              className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
