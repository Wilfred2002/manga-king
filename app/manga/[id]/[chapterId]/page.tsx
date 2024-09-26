"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Nav from '@/components/Nav'; 
import axios from 'axios';


    export async function generateStaticParams() {
    return null;
  }
  
  export default function ReadChapter() {
    const { id, chapterId } = useParams();
    const[mangaTitle, setmangaTitle] = useState(null);
    const[realTitle, setrealTitle] = useState(null);
    const[scanlationGroup, setscanlationGroup] = useState(null);
    const[chapterNumber, setchapterNumber] = useState(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    
      const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Smooth scrolling
        });
    };

    async function fetchChapters(){
        try{
            const response = await axios.get(`https://api.mangadex.org/chapter/${chapterId}`);
            console.log(response.data);

            const title = response.data.data.attributes.title.en;
            setmangaTitle(title);

            const number = response.data.data.attributes.chapter;
            setchapterNumber(number);

            const response5 = await axios.get(`https://api.mangadex.org/manga/${id}`)
            console.log(response5.data);

            let real = response5.data.data.attributes.title.en;

            if(!real){
                real = response5.data.data.attributes.title['ja-ro'];
                setrealTitle(real);
            }
            setrealTitle(real);

            const scanId = response.data.data.relationships[0].id;
            const response2 = await axios.get(`https://api.mangadex.org/group/${scanId}`)
            console.log(response2.data);

            const scanGroup = response2.data.data.attributes.name;
            setscanlationGroup(scanGroup);

            const response3 = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
            console.log(response3.data);

            const baseUrl = response3.data.baseUrl;
            const chapterHash = response3.data.chapter.hash;
            const imageArray = response3.data.chapter.data;

            const urls = imageArray.map((imageFileName: string) => `${baseUrl}/data/${chapterHash}/${imageFileName}`);
            setImageUrls(urls);
            setLoading(false);
        }
        catch(error){
            console.log("Error:", error);
        }
    }
    
    useEffect(() =>{
        if(chapterId){
            fetchChapters();
        }
    }, [fetchChapters, chapterId]);

    return (
        <div className = "min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
            <Nav></Nav>
            <div className = "flex flex-col py-8 max-w-screen-xl mx-auto justify-center items-center">
                <h1 className = "font-bold text-3xl">Chapter : {chapterNumber ? chapterNumber : "Loading chapter:"}</h1>
                <h1 className = "font-bold text-3xl">{mangaTitle ? mangaTitle : ""}</h1>
                <h1 className = "font-bold text-2xl">{realTitle ? realTitle : "Loading title"}</h1>
                <h1 className = "font-light">{scanlationGroup ? scanlationGroup : "loading group"}</h1>

                <div className = "p-8 flex flex-wrap justify-center">
                {loading ? (
                    <p>Loading images...</p>
                ) : (
                    imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Page ${index + 1}`}
                            className="w-full max-w-4xl mb-4"
                            loading = "lazy" 
                        />
                    ))
                )}

                </div>
                <h1 className = "font-bold text-3xl">Chapter : {chapterNumber ? chapterNumber : "Loading chapter:"}</h1>
                <h1 className = "font-bold text-3xl">{mangaTitle ? mangaTitle : ""}</h1>
                <h1 className = "font-bold text-2xl">{realTitle ? realTitle : "Loading title"}</h1>
                <h1 className = "font-light">{scanlationGroup ? scanlationGroup : "loading group"}</h1>
            </div>
            <button
                onClick={scrollToTop}
                className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full shadow-lg"
                style={{ zIndex: 1000 }}
            >
                ↑ Top
            </button>
        </div>
    );
}
