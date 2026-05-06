"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Course = {
  course_id: number;
  title: string;
  description: string;
  category_id: number;
  image_url?: string | null;
  course_image?: string | null;
};

type Category = {
  category_id: number;
  category_name: string;
};

type SelectedCategory = "All" | number;

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>("All");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        if (!res.ok) throw new Error("Courses API failed");

        const data = await res.json();
        const safeData: Course[] = Array.isArray(data) ? data : [];

        setCourses(safeData);
        setFilteredCourses(safeData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        if (!res.ok) throw new Error("Categories API failed");

        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };

    fetchCourses();
    fetchCategories();

    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleFilter = (categoryId: SelectedCategory) => {
    setSelectedCategory(categoryId);

    if (categoryId === "All") {
      setFilteredCourses(courses);
      return;
    }

    setFilteredCourses(
      courses.filter((course) => Number(course.category_id) === categoryId)
    );
  };

  const getImageUrl = (course: Course) => {
    const img = course.image_url || course.course_image;

    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;

    return img;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(
      (cat) => Number(cat.category_id) === Number(categoryId)
    );

    return category ? category.category_name : "General";
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-36 pb-20">
      <div
        className={`max-w-6xl mx-auto px-6 transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#0F3D3E]">
            Courses Page
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Browse and filter through our curated collection
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => handleFilter("All")}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 shadow-sm ${
              selectedCategory === "All"
                ? "bg-[#FFD166] text-[#0F3D3E] border-[#FFD166] shadow-md"
                : "bg-[#FFF4D8] text-[#0F3D3E] border-[#FFE8B0] hover:bg-[#FFD166]"
            }`}
          >
            All Courses
          </button>

          {categories.map((cat) => (
            <button
              key={cat.category_id}
              onClick={() => handleFilter(cat.category_id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300 shadow-sm ${
                selectedCategory === cat.category_id
                  ? "bg-[#FFD166] text-[#0F3D3E] border-[#FFD166] shadow-md"
                  : "bg-[#FFF4D8] text-[#0F3D3E] border-[#FFE8B0] hover:bg-[#FFD166]"
              }`}
            >
              {cat.category_name}
            </button>
          ))}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-gray-500">
              No courses found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <div
                key={course.course_id}
                style={{
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: "both",
                }}
                className="
                  group overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100
                  transition-all duration-500 ease-out
                  hover:shadow-xl hover:-translate-y-3
                  animate-[fadeSlideUp_0.4s_ease-out]
                "
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(course)}
                    alt={course.title}
                    className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/10 to-transparent group-hover:opacity-100" />
                </div>

                <div className="p-6 min-h-[190px] flex flex-col justify-between">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold leading-snug text-[#0F3D3E] line-clamp-1">
                      {course.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <span className="inline-block text-xs font-semibold text-[#0F3D3E] bg-[#FFF4D8] border border-[#FFE8B0] px-3 py-1.5 rounded-full">
                      {getCategoryName(course.category_id)}
                    </span>

                    <Link
                      href={`/courses/${course.course_id}`}
                      className="flex items-center gap-1 text-sm font-semibold text-[#D99A00] transition-all duration-300 hover:text-[#B77D00]"
                    >
                      View
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}