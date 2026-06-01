"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

type Course = {
  course_id: number;
  title: string;
  description: string;
  category: string | null;
  image_url: string | null;
  enrolled_count: number;
};

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/courses");
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch admin courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) return "/placeholder.png";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FDF8F3] px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-[#0F3D3E]">
              Manage Courses
            </h1>

            <p className="mt-3 text-lg text-gray-600">
              View and manage all Learnio courses.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading courses...</p>
          ) : courses.length === 0 ? (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-md">
              <p className="text-lg font-semibold text-gray-500">
                No courses available yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.course_id}
                  className="group overflow-hidden rounded-[24px] bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_35px_rgba(46,196,182,0.22)]"
                >
                  <div className="h-[235px] overflow-hidden bg-[#FDF8F3]">
                    <img
                      src={getImageUrl(course.image_url)}
                      alt={course.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6">
                    <h2 className="mb-3 text-2xl font-bold text-[#0F3D3E]">
                      {course.title}
                    </h2>

                    <p className="min-h-[72px] text-base leading-relaxed text-[#5B6472] line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between gap-4 mt-8">
                     

                      <span className="text-sm font-bold text-[#1F7A8C]">
                        {course.enrolled_count || 0} enrolled
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/admin/courses/${course.course_id}/manage`)
                      }
                      className="mt-6 w-full rounded-2xl bg-[#0F3D3E] py-4 font-bold text-white transition hover:bg-[#1F7A8C]"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
