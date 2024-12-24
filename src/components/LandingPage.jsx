import React from "react";
import { Button } from "./ui/button";
import FeatureCard from "./FeatureCard";
import { Footer } from "./Footer";

function LandingPage() {
  const heroContent = {
    heading:
      "Achieve Your Goals with Personalized Challenges and Community Support",
    paragraph:
      "JourneySkill helps you stay on track while learning a new skill. Whether it's coding, drawing, or anything else, set your own challenge, share your progress, and connect with a supportive community to keep you motivated.",
  };
  return (
    <>
      <main
        className="  container flex flex-col  mx-auto rounded items-center  justify-center  min-h-screen 
        text-center 
    "
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl max-w-4xl">
          {heroContent.heading}
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-xl ">
          {heroContent.paragraph}
        </p>
        <Button className="mt-6 ">Get Started –It&apos;s Free!</Button>
      </main>
      <section className="container flex flex-col items-center justify-center  mx-auto">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          How JourneySkill Works
        </h2>

        <div className="my-20 flex flex-col gap-2 md:flex-row item-center justify-center md:w-full flex-wrap ">
          <FeatureCard />
        </div>
      </section>
      <section
        className="flex items-center flex-col justify-center w-full p-4 h-screen
       relative
      "
      >
        <div
          className="blob absolute bg-gradient-to-tl
         from-green-700 to-green-600 blur-3xl w-72 h-72 top-1/2 left-1/2 transform opacity-50  
          -translate-x-1/2 -translate-y-1/2 -z-10"
        ></div>
        <h2 className="scroll-m-20 text-5xl font-semibold tracking-tight">
          Start Your Journey Today
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-xl text-center">
          No matter what skill you’re learning, JourneySkill is here to help you
          stay consistent and celebrate every step forward.
        </p>
        <Button className="mt-6 ">Get Started</Button>
      </section>

      <Footer />
    </>
  );
}

export default LandingPage;
