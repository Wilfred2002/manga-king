import ReadChapterClient from "./ReadChapter";
// Mock data for the example. Replace this with your API call.
const chapters = [
  { id: 'manga1', chapterId: 'chapter1' },
  { id: 'manga2', chapterId: 'chapter2' },
];

// Generate static params for dynamic routes
export async function generateStaticParams() {
  // Here, you'd typically fetch all manga and chapters to pre-generate the static paths.
  return chapters.map((chapter) => ({
    id: chapter.id,
    chapterId: chapter.chapterId,
  }));
}

export default function ReadChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  const { id, chapterId } = params;

  return <ReadChapterClient id={id} chapterId={chapterId} />;
}

