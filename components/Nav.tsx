import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "./ui/ModeToggle";

export default function Nav() {
  return (
    <nav>
      <header className="flex justify-between items-center p-14">
        <Link href="/">
          <h1 className="text-3xl">Manga King</h1>
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
    </nav>
  );
}
