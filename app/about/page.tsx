import Nav from "../../components/Nav";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 text-black dark:text-gray-300">
      <Nav />
      <div className="flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-center">
          About This Project
        </h1>
        <p className="text-lg max-w-2xl text-center">
          This website was developed by Wilfred Naraga as an educational project.
          Built on Typescript using NextJS and Tailwind CSS. Credit goes to MangaDex!
        </p>
      </div>
    </div>
  );
}
