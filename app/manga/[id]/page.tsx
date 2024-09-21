"use client"; 

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

  async function fetchData(){
    try{
      const response = await axios.get(`https://api.mangadex.org/manga/${id}`)
      console.log(response.data); //logging json file 

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
        const response2 = await axios.get(`https://api.mangadex.org/author/${authorID}`);
        console.log(response2.data);

        const authorName = response2.data.data.attributes.name;
        setAuthor(authorName);
      }


    

    } catch(error){
      console.error("error:", error);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />
      <h1>{manga ? manga : "Loading title..."}</h1>
      <h1>{mangaType ? mangaType : "Loading type..."}</h1>
      <h1>{author ? author : "Loading author..."}</h1>

    </div>
  );
}

export default MangaDetails;
