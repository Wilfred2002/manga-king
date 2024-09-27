import ReadChapter from "./ReadChapter";


function ReadChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  const { id, chapterId } = params; 

  return <ReadChapter id={id} chapterId={chapterId} />;
}
