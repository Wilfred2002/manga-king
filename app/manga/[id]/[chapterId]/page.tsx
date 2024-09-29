import Nav from "@/components/Nav";
import Image from "next/image";

interface Relationship {
  id: string;
  type: string;
}


export default async function ReadChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  const { id, chapterId } = params; 

  const chapterRes = await fetch(`https://api.mangadex.org/chapter/${chapterId}`);
  const chapterData = await chapterRes.json();

  const mangaTitle = chapterData.data.attributes.title || "";
  const chapterNumber = chapterData.data.attributes.chapter || "No chapter number";

  const mangaRes = await fetch(`https://api.mangadex.org/manga/${id}`);
  const mangaData = await mangaRes.json();

  const realTitle = mangaData.data.attributes.title.en || mangaData.data.attributes.title["ja-ro"] || "No title available";

  const scanId = chapterData.data.relationships.find((rel: Relationship) => rel.type === "scanlation_group")?.id;
  let scanGroup = "Unknown Group";
  if (scanId) {
    const scanlationGroupRes = await fetch(`https://api.mangadex.org/group/${scanId}`);
    const scanlationGroupData = await scanlationGroupRes.json();
    scanGroup = scanlationGroupData.data.attributes.name || scanGroup;
  }

  // Fetch chapter images
  const chapterImagesRes = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
  const chapterImagesData = await chapterImagesRes.json();

  const chapterHash = chapterImagesData.chapter.hash;
  const imageArray = chapterImagesData.chapter.data;

  // Construct image URLs
  const imageUrls = imageArray.map((imageFileName: string) => `https://uploads.mangadex.org/data/${chapterHash}/${imageFileName}`);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
      <Nav />
      <div className="flex flex-col py-8 max-w-screen-xl mx-auto items-center justify-center">
        <h1 className="font-bold text-3xl">Chapter: {chapterNumber}</h1>
        <h1 className="font-bold text-3xl">{mangaTitle}</h1>
        <h1 className="font-bold text-2xl">{realTitle}</h1>
        <h1 className="font-light">{scanGroup}</h1>

        <div className="p-8 flex flex-wrap justify-center">
          {imageUrls.length > 0 ? (
            imageUrls.map((url: string, index: number) => (
              <div key={index} className="w-full max-w-4xl mb-4 relative" style={{ height: 'auto' }}>
                <Image
                  src={url}
                  alt={`Page ${index + 1}`}
                  layout="responsive"
                  width={700}
                  height={1000}
                  priority={index === 0} // Optional: prioritize the first image
                />
              </div>
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        <h1 className="font-bold text-3xl">Chapter: {chapterNumber}</h1>
        <h1 className="font-bold text-3xl">{mangaTitle}</h1>
        <h1 className="font-bold text-2xl">{realTitle}</h1>
        <h1 className="font-light">{scanGroup}</h1>
      </div>
    </div>
  );
}