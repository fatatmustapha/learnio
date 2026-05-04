"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log("COURSES:", data); // debug
        setCourses(data);
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <section className="py-16 px-6 bg-[#FDF8F3]">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center text-[#2F3E34] mb-10">
        Featured Courses
      </h2>

      {/* Empty state */}
      {courses.length === 0 && (
        <p className="text-center text-gray-500">
          No courses available.
        </p>
      )}

      {/* Courses Grid (ONLY 3) */}
      <div className="grid max-w-6xl grid-cols-1 gap-8 mx-auto sm:grid-cols-2 md:grid-cols-3">
        {courses.slice(0, 3).map((course) => (
          <div
            key={course.course_id}
            className="overflow-hidden transition bg-white shadow-md rounded-xl hover:shadow-lg"
          >
            {/* Image */}
            <img
              src={course.course_image}
              alt={course.title}
              className="object-cover w-full h-48"
            />

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#2F3E34]">
                {course.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                {course.description}
              </p>

              
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <Link href="/courses">
          <button className="bg-[#7CB98B] text-white px-6 py-3 rounded-lg hover:bg-[#6aa87a] transition">
            View All Courses
          </button>
        </Link>
      </div>
    </section>
  );
}