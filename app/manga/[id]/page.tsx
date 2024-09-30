import MangaDetails from "./MangaDetails";
import Nav from "@/components/Nav";

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

//hio

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

interface Manga {
  data:{
    id: string;
    attributes: MangaAttributes;
    relationships: MangaRelationship[];
  }

}
//hi
interface Chapter {
  id: string;
  type: string;
  attributes: ChapterAttributes;
}



export default async function Page({ params }: { params: { id: string } }) {
  const proxyURL = ""
  const mangaId = params.id;
  const chapters: Chapter[] = [];

  const chapterRes = await fetch(`https://api.mangadex.org/manga/${params.id}/feed?limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includeFutureUpdates=1&order[createdAt]=asc&order[updatedAt]=asc&order[publishAt]=asc&order[readableAt]=asc&order[volume]=asc&order[chapter]=asc`);
  
  const chapterData = await chapterRes.json();
  const mangaChapters = chapterData.data || []; // Extract chapter array, default to empty array

  mangaChapters.forEach((chapter: Chapter) => {
    if (chapter.attributes.translatedLanguage === 'en') {
      chapters.push(chapter);
    }
  });


  const mangaRes = await fetch(
    `https://api.mangadex.org/manga/${params.id}?includes[]=cover_art&includes[]=author&includes[]=artist&includes[]=tag&includes[]=creator`
  );
  const mangaData= await mangaRes.json();
  console.log(mangaData.data.relationships);

  const relationships = mangaData?.data?.relationships || [];
  const authorRelation = relationships.find(
    (rel: MangaRelationship) => rel.type === "author"
  );
  const authorName = authorRelation?.attributes?.name || "Unknown Author";


  const getCoverUrl = (manga: Manga) => {
    // Ensure relationships exist and find the cover_art relationship
    const coverRelation = manga.data.relationships.find(
      (rel: MangaRelationship) => rel.type === "cover_art"
    );
  
    // Ensure coverRelation and its attributes exist, then return the constructed cover URL
    if (coverRelation && coverRelation.attributes && coverRelation.attributes.fileName) {
      const coverFileName = coverRelation.attributes.fileName; // Full filename (e.g., "xyz.png")
      return `https://proxy-server-five-khaki.vercel.app/proxy-cover/${mangaId}/${coverFileName}?size=512`; // Use 256 or 512 pixel version
    }
  
    // Return a fallback image if no cover is available
    return '/fallback-image.jpg';
  };

// Get the cover URL, if available
const coverUrl = getCoverUrl(mangaData);



  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
      <Nav />
      <div className="flex flex-col md:flex-row py-8 max-w-screen-xl mx-auto">
        <div className="w-1/3">
          <img src={coverUrl || "/default-cover.jpg"} alt="manga cover" />
        </div>
        <div className="w-2/3 px-6">
          <h1 className="text-4xl font-bold">
            {mangaData.data.attributes.title.en || mangaData.data.attributes.title["ja-ro"] || ""}
          </h1>
          <div className="border-t border-gray-600 my-4"></div>
          <div>
            <span className="text-gray-400">Origination: </span>
            <span>{mangaData.data.type || "Loading type..."}</span>
          </div>
          <div>
            <span className="text-gray-400">Demographic: </span>
            <span>{mangaData.data.attributes.publicationDemographic || ""}</span>
          </div>
          <div>
            <span className="text-gray-400">Published: </span>
            <span>200</span>
          </div>
          <div>
            <span className="text-gray-400">Status: </span>
            <span>{mangaData.data.attributes.status || "Loading manga status..."}</span>
          </div>
          <div>
            <span className="text-gray-400">Rating: </span>
            <span>200</span>
          </div>

          <h1 className="text-2xl py-3 font-bold">Description</h1>
          <p>{mangaData.data.attributes.description.en || "Loading description..."}</p>
          <div className="py-6">Read Ch.1</div>
          <div className="border-t border-gray-600 my-4"></div>
          <h1 className="text-2xl py-3 font-bold">More Info</h1>
          <div>
            <span className="text-gray-400">Artist: </span>
            <span>artists</span>
          </div>
          <div>
            <span className="text-gray-400">Author: </span>
            <span>{authorName}</span>
          </div>
        </div>
      </div>
        <MangaDetails chapters={chapters} mangaId={mangaId} />
    </div>
  );
}