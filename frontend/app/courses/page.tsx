"use client";

import { useEffect, useState } from "react";

type Course = {
  course_id: number;
  title: string;
  description: string;
  course_image: string;
  category_id: number;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [open, setOpen] = useState(false);

  const categories = [
    { label: "All Courses", value: "all" },
    { label: "Finance", value: "1" },
    { label: "Science", value: "2" },
    { label: "Technology", value: "3" },
    { label: "Environment", value: "4" },
    { label: "History", value: "5" },
  ];

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses");
      const data = await res.json();

      console.log("COURSES FROM API:", data); // 🔥 DEBUG

      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    setOpen(false);

    if (category === "all") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (c) => Number(c.category_id) === Number(category)
      );

      console.log("FILTERED:", filtered); // 🔥 DEBUG

      setFilteredCourses(filtered);
    }
  };

  const selectedLabel =
    categories.find((c) => c.value === selectedCategory)?.label ||
    "All Courses";

  return (
    <div className="min-h-screen bg-[#FDF8F3] px-6 py-10">

      {/* 🔥 DYNAMIC HEADING */}
      <h1 className="text-3xl font-bold text-center text-[#0F3D3E] mb-10">
        {selectedLabel}
      </h1>

      {/* DROPDOWN */}
      <div className="flex justify-start max-w-6xl mx-auto mb-10">
        <div className="relative w-56">

          <button
            onClick={() => setOpen(!open)}
            className="w-full bg-[#FFF4D6] text-[#0F3D3E] font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow-md transition flex justify-between items-center"
          >
            {selectedLabel}
            <span>▼</span>
          </button>

          {open && (
            <div className="absolute z-50 w-full mt-2 overflow-hidden bg-white shadow-lg rounded-xl">
              {categories.map((cat) => (
                <div
                  key={cat.value}
                  onClick={() => handleFilter(cat.value)}
                  className={`px-4 py-2 cursor-pointer transition ${
                    selectedCategory === cat.value
                      ? "bg-[#F5A962] text-white"
                      : "hover:bg-[#FFF4D6]"
                  }`}
                >
                  {cat.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 COURSES GRID */}
      <div className="grid max-w-6xl gap-10 mx-auto md:grid-cols-3">

        {filteredCourses.length === 0 ? (
          <p className="col-span-3 text-center text-gray-500">
            No courses found in this category.
          </p>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.course_id}
              className="overflow-hidden transition duration-300 bg-white shadow-md rounded-xl hover:shadow-xl"
            >
              <img
                src={`http://localhost:5000${course.course_image}`}
                alt={course.title}
                className="object-cover w-full h-48"
              />

              <div className="p-5">
                <h3 className="text-xl font-bold text-[#0F3D3E] mb-2">
                  {course.title}
                </h3>

                <p className="mb-4 text-sm text-gray-600">
                  {course.description}
                </p>

                <button
                  className="bg-[#F5A962] text-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-[#F5A962] border border-[#F5A962] transition"
                  onClick={() =>
                    (window.location.href = `/courses/${course.course_id}`)
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}