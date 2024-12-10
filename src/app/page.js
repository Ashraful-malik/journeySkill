import WaitList from "@/components/waitlist/Waitlist";
import Link from "next/link";

export default function Home() {
  const content = {
    title:
      "Achieve Your Goals with Personalized Challenges and Community Support",
    description:
      "Build skills publicly, track progress, and grow with a supportive community tailored to your journey.",
  };
  return (
    // importing script
    <>
      <main className="flex min-h-screen item-center justify-center ">
        <section className="flex flex-col  justify-center items-center w-full md:w-4/5 p-6 md:p-12 text-center ">
          <h1 className=" text-3xl font-bold md:text-5xl text text-gray-950 dark:text-gray-100">
            {content.title}
          </h1>
          <p className="md:text-xl mt-6 max-w-screen-sm text-gray-400 text-center dark:text-gray-400">
            {content.description}
          </p>
          <div className="w-full flex items-center justify-center  mt-8">
            {/* //Waitlist from */}
            <WaitList />
          </div>
        </section>
      </main>
    </>
  );
}
