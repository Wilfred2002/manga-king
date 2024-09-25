"use client";

import { Button } from  '@/components/ui/button'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav'; 
import axios from 'axios';

function readChapter() {
    const {chapterId} = useParams();
    const[mangaTitle, setmangaTitle] = useState(null);


    async function fetchChapters(){
        try{

            const response = await axios.get(`https://api.mangadex.org/manga/${chapterId}`);
            console.log(response.data);

            const title = response.data.attributes.title.en;
            setmangaTitle(title);
        }
        catch(error){
            console.log("Error:", error);
        }
    }
    
    useEffect(() =>{
        fetchChapters();
    }, [chapterId]);


    }
    return (
        <div className = "min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
            <Nav></Nav>


        </div>


    
    );
}

