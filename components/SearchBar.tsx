"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Handle form submission and navigate to the search results page
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="border rounded px-4 py-2"
      />
      <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Search
      </button>
    </form>
  );
}
