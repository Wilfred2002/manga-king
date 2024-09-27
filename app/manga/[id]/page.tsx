import MangaDetails from "./MangaDetails";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300 font-sans">
      <MangaDetails params={params} />
    </div>
  );
}
