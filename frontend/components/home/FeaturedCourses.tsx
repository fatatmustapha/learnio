"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:5000";

type Course = {
  course_id: number;
  title: string;
  description: string;
  image_url?: string | null;
  course_image?: string | null;
};

export default function FeaturedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses`);
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  const getImageUrl = (course: Course) => {
    const img = course.image_url || course.course_image;

    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;

    return img;
  };

  return (
    <section className="py-16 bg-[#fdf8f3]">
      <div className="max-w-6xl px-6 mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#2F3E34] mb-12">
          Featured Courses
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course.course_id}
              className="overflow-hidden transition-all duration-300 ease-in-out bg-white shadow group rounded-xl hover:-translate-y-3 hover:shadow-2xl"
            >
              {/* IMAGE */}
              <div className="w-full overflow-hidden bg-white h-72">
                <img
                  src={getImageUrl(course)}
                  alt={course.title}
                  className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 text-left min-h-[150px]">
                <h3 className="text-lg font-semibold text-[#2F3E34]">
                  {course.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {course.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="mt-12">
          <Link
            href="/courses"
            className="
              inline-block px-8 py-3
              bg-[#facb5d] text-white font-semibold rounded-lg shadow-md
              transition-all duration-300 ease-in-out
              hover:bg-[#e68e36] hover:-translate-y-1 hover:scale-105 hover:shadow-lg
            "
          >
            View Courses
          </Link>
        </div>
      </div>
    </section>
  );
}