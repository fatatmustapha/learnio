"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// TYPE
type Course = {
  course_id: number;
  title: string;
  description: string;
  course_image: string;
};

export default function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/courses/featured")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-20 px-6 bg-[#FDF8F3] text-center">
      <h2 className="text-4xl font-extrabold mb-12 text-[#0F3D3E]">
        Featured Courses
      </h2>

      <div className="grid max-w-6xl gap-10 mx-auto md:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.course_id}
            className="
              bg-white rounded-2xl overflow-hidden
              shadow-md
              hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]
              transition-all duration-300
              hover:-translate-y-2
              flex flex-col
            "
          >
            {/* IMAGE */}
            <img
              src={course.course_image}
              alt={course.title}
              className="object-cover w-full h-48"
            />

            {/* CONTENT */}
            <div className="flex flex-col flex-grow p-5 text-left">
              <h3 className="text-xl font-bold text-[#0F3D3E] mb-2">
                {course.title}
              </h3>

              <p className="mb-6 text-sm text-gray-600">
                {course.description}
              </p>

              {/* BUTTON */}
              <div className="flex justify-center mt-auto">
                <button
                  onClick={() => router.push("/courses")}
                  className="
                    px-6 py-2 rounded-lg font-bold
                    bg-[#F5C45E] text-white
                    transition-all duration-300
                    hover:bg-white hover:text-[#F5C45E]
                    hover:border hover:border-[#F5C45E]
                  "
                >
                  View More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}