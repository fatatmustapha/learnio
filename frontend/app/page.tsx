import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/home/Hero";
import WhyLearnio from "@/components/home/WhyLearnio";
import FeaturedCourses from "@/components/home/FeaturedCourses";

export default function Home() {
  return (
    <>
      

      <div className="pt-14">
        <Hero />
        <WhyLearnio />
        <FeaturedCourses />
      </div>
    </>
  );
}