import Nav from "../../components/Nav";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />
      <div className="flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          About This Project
        </h1>
        <p className="text-lg max-w-2xl text-left">
          This website was developed by Wilfred Naraga as an educational project.
          Built on Typescript using NextJS, styled using Tailwind CSS. All the data that is being displayed in this website is sourced
          from the MangaDex api, so all credit goes to them and their team for allowing me to make this project.
        </p>
        <p className = "text-lg max-w-2xl text-left py-8">
          If you dont find chapters for a manga, its because MangaDex doesnt have any english translations or scanlations for that manga. All source code can be
          found on Github
        </p>
      </div>
    </div>
  );
}
