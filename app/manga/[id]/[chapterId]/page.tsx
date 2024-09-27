import ReadChapter from "./ReadChapter";

function generateStaticParams(){
  return [];
}

export default function ReadChapterPage({ params }: { params: { id: string; chapterId: string } }) {
  const { id, chapterId } = params; 

  return <ReadChapter id={id} chapterId={chapterId} />;
}
