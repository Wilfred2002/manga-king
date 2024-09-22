"use client"; 

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

//importing table from shadcn

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav'; 
import axios from 'axios';


function MangaDetails() {
  const {id} = useParams();
  const[mangaType, setMangaType] = useState(null);
  const[manga, setManga] = useState(null);
  const[author, setAuthor] = useState(null);
  const[authorsID, setauthorsID] = useState(null);
  const[coverArt, setCoverArt] = useState(null);
  const[mangaStatus, setmangaStatus] = useState(null);
  const[mangaDemographic, setmangaDemographic] = useState(null);
  const[mangaDescription, setmangaDescription] = useState(null);
  const[mangaArtists, setmangaArtist] = useState(null);
  const[mangaRating, setmangaRating] = useState(null);
  const[mangaPublished, setmangaPublished] = useState(null);
  const[mangaChapters, setmangaChapters] = useState([]);
  const[displayLimit, setDisplayLimit] = useState(15);

  //Setting useState 

  const getCoverUrl = (manga) => {
    const coverRelation = manga.relationships.find((rel) => rel.type === "cover_art");
    if (coverRelation && coverRelation.attributes && coverRelation.attributes.fileName) {
      // construct url using both manga.id and the fileName
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverRelation.attributes.fileName}.512.jpg`;
    }
    return null;
  };

  async function fetchData(){
    try{
      const response = await axios.get(`https://api.mangadex.org/manga/${id}?includes%5B%5D=cover_art&includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag&includes%5B%5D=creator`)
      console.log(response.data); //logging json file 

      const coverPic = getCoverUrl(response.data.data);
      setCoverArt(coverPic);

      let title = response.data.data.attributes.title.en;
      if(!title){
        title = response.data.data.attributes.title['ja-ro'];
        setManga(title);
      }
      setManga(title); //if there is no english language title fall back and use japanese title for main title

      const type = response.data.data.type;
      setMangaType(type); //setting type aka manga/manwha 

      const authorID = response.data.data.relationships[0].id;
      setauthorsID(authorID); //grabbing author's ID from first api call

      if(authorID){
        const response2 = await axios.get(`https://api.mangadex.org/author/${authorID}`); //second API call for author's name
        console.log(response2.data);

        const authorName = response2.data.data.attributes.name; //setting the name
        setAuthor(authorName);
      } else {
        console.error("No author found");
      }

      const status = response.data.data.attributes.status;
      setmangaStatus(status); //getting status of manga

      const demographic = response.data.data.attributes.publicationDemographic;
      setmangaDemographic(demographic); //grabbing description of manga

      const descript = response.data.data.attributes.description.en;
      const trimmedDescription = descript.split('---')[0].trim();
      setmangaDescription(trimmedDescription); // grabbing english description

      const artist = response.data.data.relationships[1].attributes.name;
      setmangaArtist(artist);

      const year = response.data.data.attributes.year;
      setmangaPublished(year);

      const chaptersResponse = await axios.get(`https://api.mangadex.org/chapter?manga=${id}`);
      console.log(chaptersResponse.data);
      setmangaChapters(chaptersResponse.data);

      //const response3 = await axios.get(`https://api.mangadex.org/rating?manga=`, {
      //  params: { manga: [id] } // Passing the ID as an array
      //});

      //console.log(response3.data);
      //const rating = response3.data.ratings.rating;
      //setmangaRating(rating);



    } catch(error){
      console.error("error:", error);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
      <Nav />
      <div className = "flex flex-col md:flex-row py-8 max-w-screen-xl mx-auto"> 
        <div className = "w-1/3">
          <div>{coverArt ? <img src ={coverArt} alt = "manga cover"></img> : <p>No cover art available</p>}</div>
        </div>
        <div className = "w-2/3 px-6">

          <h1 className = "text-4xl font-bold">{manga ? manga : "Loading title..."}</h1>
          <div className = "border-t border-gray-600 my-4"></div>

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
            <span className = "text-gray-400">Rating: </span>
            <span>{mangaRating ? mangaRating : "Loading rating..."}</span>
          </div>

          <h1 className="text-2xl py-3 font-bold">Description</h1>
          <p>{mangaDescription ? mangaDescription : "Loading description..."}</p>

          <div className = "border-t border-gray-600 my-4"></div>

          <h1 className = "text-2xl py-3 font-bold">More Info</h1>
          
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

      <div className = "flex flex-col py-16 max-w-screen-xl mx-auto">
        <h1 className = "text-3xl font-bold px-6">Chapters List</h1>

        <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Chapter</TableHead>
              <TableHead className="w-[150px]">Uploaded</TableHead>
              <TableHead className="w-[200px]">Group</TableHead>
              <TableHead className="text-right w-[120px]">Read</TableHead>  {/* Updated header */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {mangaChapters && mangaChapters.data && mangaChapters.data.map((chapter) => (
              <TableRow key={chapter.id}>
                <TableCell className="text-center">{chapter.attributes.chapter || "N/A"}</TableCell>
                <TableCell>{chapter.attributes.createdAt ? new Date(chapter.attributes.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>
                  {chapter.relationships.find(rel => rel.type === 'scanlation_group' && rel.attributes) ?
                    chapter.relationships.find(rel => rel.type === 'scanlation_group').attributes.name : "Unknown"}
                </TableCell>
                <TableCell className="text-right">
                  <a href={`/read/${chapter.id}`} className="text-blue-500 hover:text-blue-700">Read Chapter</a>  {/* Placeholder for the link */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        </div>


      </div>

    </div>
  );
}

export default MangaDetails;
