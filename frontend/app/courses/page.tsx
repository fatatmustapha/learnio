"use client";
import { useEffect, useState } from "react";

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

    // Trigger entrance animation
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
    <div
      className={`max-w-6xl mx-auto px-6 py-10 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >

       {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
       
        </h1>
       
      </div>
      
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* "All" pill */}
        <button
          onClick={() => handleFilter("All")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
            selectedCategory === "All"
              ? "bg-gray-900 text-white border-gray-900 shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
          }`}
        >
          All Courses
        </button>

        {categories.map((cat) => (
          <button
            key={cat.category_id}
            onClick={() => handleFilter(cat.category_id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              selectedCategory === cat.category_id
                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
            <svg
              className="text-gray-400 w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No courses found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <div
              key={course.course_id}
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: "both",
              }}
              className="group overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100
                         hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out
                         animate-[fadeSlideUp_0.4s_ease-out]"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(course)}
                  alt={course.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/10 to-transparent group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-1 text-base font-semibold leading-snug text-gray-900 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
                  {course.description}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between mt-4">
                  <span className="inline-block text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                    {getCategoryName(course.category_id)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400 transition-colors group-hover:text-gray-700">
                    View
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}