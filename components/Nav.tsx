import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./ui/ModeToggle";

export default function Nav() {
  return (
    <nav>
      <header className="flex justify-between items-center px-10 py-2">
      <img src="/pngs/pngegg.png" alt="Logo" className="h-12 w-auto" /> {/* Adjusted image path */}
        <Link href="/">
          <h1 className="text-2xl">Manga King</h1>
        </Link>
        <ul className="flex space-x-4 ml-auto">
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
      <div>
          <hr className = "border-t border-gray-700"></hr>
        </div>
    </nav>
  );
}
