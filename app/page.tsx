import Nav from "../components/Nav";
import Link from "next/link"; 
import Image from "next/image";

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

interface MangaListResponse {
  data: Manga[];
}


export default async function Home() {
  // Fetch manga list from the API
  const res = await fetch('https://api.mangadex.org/manga?limit=10&order[followedCount]=desc&includes[]=cover_art');
  const data = await res.json();
  
  // Ensure mangaList is an array (in case the response structure is different)
  const mangaList = data?.data || []; 

  // Helper function to get cover URL
  const getCoverUrl = (manga: any) => {
    const coverRelation = manga.relationships.find((rel: any) => rel.type === "cover_art");
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mangaList.map((manga: any) => (
            <Link href={`/manga/${manga.id}`} key={manga.id}>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer">
                {getCoverUrl(manga) ? (
                  <Image
                    src={getCoverUrl(manga) || '/fallback-image.jpg'} // Provide a fallback image in case `getCoverUrl` returns null
                    alt={`${manga.attributes.title.en || "Untitled"} Cover`}
                    width={512} // Provide the width in pixels
                    height={1024} // Provide the height in pixels

                    priority={true} // Optional: Load the image with higher priority if it's important for the page
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
      </section>
    </div>
  );
}
