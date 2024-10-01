"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./ui/ModeToggle";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  return (
    <nav className="bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <header className="flex justify-between items-center px-10 py-2">
        <img src="/pngs/pngegg.png" alt="Logo" className="h-12 w-auto" /> 
        <Link href="/">
          <h1 className="text-2xl">Manga King</h1>
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-gray-500 dark:text-gray-300 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Full Menu for larger screens */}
        <ul className="hidden md:flex space-x-4 ml-auto items-center">
          <li>
            <SearchBar />
          </li>
          <li>
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <Button variant="ghost">About</Button>
            </Link>
          </li>
          <ModeToggle />
        </ul>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <ul className="space-y-2 px-4 py-2">
            <li className = "justify-center pl-24">
              <SearchBar />
            </li>
            <li>
              <Link href="/">
                <Button variant="ghost" className="w-full text-left">
                  Home
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <Button variant="ghost" className="w-full text-left">
                  About
                </Button>
              </Link>
            </li>
            <ModeToggle />
          </ul>
        </div>
      )}

      <div>
        <hr className="border-t border-gray-700"></hr>
      </div>
    </nav>
  );
}
