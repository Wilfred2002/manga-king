import Nav from "@/components/Nav";

interface Manga {
  id: string;
  attributes: MangaAttributes;
  relationships: MangaRelationship[];
}

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
    description?: string;
    name?: string;
    fileName?: string;
    locale?: string;
  };
}

export default async function SearchResults({ searchParams }: { searchParams: { query: string } }) {
  const query = searchParams.query || "";

  if (!query) {
    return (
      <div className="flex flex-col py-8 max-w-screen-xl mx-auto">
        <p>No search query provided.</p>
      </div>
    );
  }

  const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  const { data, error } = await res.json();

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />
      <div className="flex flex-col py-8 max-w-screen-xl mx-auto">
        <h1 className="text-2xl mb-4">Search Results for: &quot;{query}&quot;</h1>

        {data && data.length > 0 ? (
          <ul>
            {data.map((manga: Manga) => (
              <li key={manga.id} className="mb-4">
                <a
                  href={`/manga/${manga.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {manga.attributes.title.en || "Untitled"}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}
