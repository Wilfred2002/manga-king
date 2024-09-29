"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

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

interface ChapterRelationship {
  id: string;
  type: string;
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



export default function MangaDetails({
  chapters = [], 
  mangaId,
}: MangaDetailsProps) {
  return (
    <div className="flex flex-col py-8 max-w-screen-xl mx-auto">
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
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <TableRow key={chapter.id}>
                <TableCell className="text-center">
                  {chapter.attributes.chapter || "N/A"}
                </TableCell>
                <TableCell>
                  {new Date(chapter.attributes.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{chapter.attributes.title || "Untitled"}</TableCell>
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
    </div>
  );
}