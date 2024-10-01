import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is missing" }, { status: 400 });
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `https://api.mangadex.org/manga?title=${encodedQuery}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch manga");
    }
    const data = await response.json();
    return NextResponse.json({ data: data.data });
  } catch (error) {
    return NextResponse.json({ error: Error.toString }, { status: 500 });
  }
}
