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

export default async function Home() {
  const res = await fetch('https://api.mangadex.org/manga?limit=20&order[followedCount]=desc&includes[]=cover_art');
  const data = await res.json();

  const res2 = await fetch('https://api.mangadex.org/manga?limit=20&order[latestUploadedChapter]=desc&includes[]=cover_art');
  const data2 = await res2.json()
  
  const mangaList = data?.data || []; 
  const mangaList2 = data2?.data || [];

  const getCoverUrl = (manga: Manga) => {
    const coverRelation = manga.relationships.find((rel: MangaRelationship) => rel.type === "cover_art");
    if (coverRelation && coverRelation.attributes && coverRelation.attributes.fileName) {
      return `https://uploads.mangadex.org/covers/${manga.id}/${coverRelation.attributes.fileName}.512.jpg`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
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
        <h3 className="text-2xl text-center mb-8">Hottest Manga</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mangaList.map((manga: Manga) => (
            <Link href={`/manga/${manga.id}`} key={manga.id}>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer">
                {getCoverUrl(manga) ? (
                  <Image
                    src={getCoverUrl(manga) || '/fallback-image.jpg'} // Provide a fallback image in case `getCoverUrl` returns null
                    alt={`${manga.attributes.title.en || manga.attributes.title["ja-ro"]} Cover`}
                    width={512} // Provide the width in pixels
                    height={1024} // Provide the height in pixels

                    priority={true} // Optional: Load the image with higher priority if it's important for the page
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded">
                    <span className="text-gray-500">Image not loaded</span>
                  </div>
                )}
                <h3 className="text-lg font-bold mt-4">{manga.attributes.title.en || manga.attributes.title["ja-ro"]}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {manga.attributes.description?.en?.substring(0, 100) + "..." || "No description available."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="p-12">
        <h3 className="text-2xl text-center mb-8">Recently Updated</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mangaList2.map((manga: Manga) => (
            <Link href={`/manga/${manga.id}`} key={manga.id}>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer">
                {getCoverUrl(manga) ? (
                  <Image
                    src={getCoverUrl(manga) || '/fallback-image.jpg'} // Provide a fallback image in case `getCoverUrl` returns null
                    alt={`${manga.attributes.title.en || manga.attributes.title["ja-ro"]} Cover`}
                    width={512} // Provide the width in pixels
                    height={1024} // Provide the height in pixels

                    priority={true} // Optional: Load the image with higher priority if it's important for the page
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded">
                    <span className="text-gray-500">Image not loaded</span>
                  </div>
                )}
                <h3 className="text-lg font-bold mt-4">{manga.attributes.title.en || manga.attributes.title["ja-ro"]}</h3>
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
