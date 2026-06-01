"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

export default function ManageCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState<any>(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/${courseId}/details`,
      );
      const data = await res.json();
      setCourseData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (url: string, message: string, goBack = false) => {
    if (!confirm(message)) return;

    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    alert("Deleted successfully");

    if (goBack) {
      router.push("/admin/courses");
    } else {
      fetchCourse();
    }
  };

  const editChapter = async (chapter: any) => {
    const title = prompt("Edit chapter title:", chapter.title || "");
    if (!title) return;

    await fetch(
      `http://localhost:5000/api/admin/chapters/${chapter.chapter_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      },
    );

    fetchCourse();
  };

  const editLesson = async (lesson: any) => {
    const title = prompt("Edit lesson title:", lesson.title || "");
    if (!title) return;

    const video_url = prompt("Edit video URL:", lesson.video_url || "") || "";

    await fetch(`http://localhost:5000/api/admin/lessons/${lesson.lesson_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, video_url }),
    });

    fetchCourse();
  };

  const editQuiz = async (quiz: any) => {
    const title = prompt("Edit quiz title:", quiz.title || "");
    if (!title) return;

    await fetch(`http://localhost:5000/api/admin/quizzes/${quiz.quiz_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    fetchCourse();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <h1 className="text-3xl font-bold text-[#0F3D3E]">
            Loading course...
          </h1>
        </main>
      </>
    );
  }

  if (!courseData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <h1 className="text-3xl font-bold text-[#F25F5C]">
            Course not found
          </h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFC] px-8 pt-32 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-5xl font-black text-[#0F3D3E]">
                Manage Course
              </h1>

              <p className="mt-3 text-lg text-gray-500">
                Manage lessons, chapters, and quizzes.
              </p>
            </div>

            <button
              onClick={() =>
                deleteItem(
                  `http://localhost:5000/api/admin/courses/${courseData.course.course_id}`,
                  "Are you sure you want to delete this full course?",
                  true,
                )
              }
              className="bg-[#F25F5C] hover:bg-[#d94f4c] transition text-white px-6 py-4 rounded-2xl font-bold shadow-md"
            >
              Delete Course
            </button>
          </div>

          <div className="bg-white rounded-[32px] overflow-hidden shadow-md mb-14">
            <img
              src={courseData.course.image_url}
              alt={courseData.course.title}
              className="w-full h-[230px] object-cover"
            />

            <div className="p-10">
              <h1 className="text-4xl font-black text-[#0F3D3E] mb-5">
                {courseData.course.title}
              </h1>

              <p className="text-lg leading-relaxed text-gray-600">
                {courseData.course.description}
              </p>
            </div>
          </div>

          <div className="space-y-14">
            {courseData.chapters.map((chapter: any, chapterIndex: number) => (
              <div
                key={chapter.chapter_id}
                className="bg-white rounded-[32px] p-10 shadow-md"
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-4xl font-black text-[#0F3D3E]">
                      Chapter {chapterIndex + 1}
                    </h2>

                    <p className="mt-3 text-xl text-gray-600">
                      {chapter.title}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => editChapter(chapter)}
                      className="bg-[#FFD166] hover:bg-[#e8bb52] transition text-white px-6 py-3 rounded-xl font-bold shadow-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteItem(
                          `http://localhost:5000/api/admin/chapters/${chapter.chapter_id}`,
                          "Delete this chapter?",
                        )
                      }
                      className="bg-[#F25F5C] hover:bg-[#d94f4c] transition text-white px-6 py-3 rounded-xl font-bold shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-8 space-y-10">
                  {chapter.lessons.map((lesson: any) => (
                    <div
                      key={lesson.lesson_id}
                      className="rounded-[28px] bg-[#F8FAFC] px-6 py-10 shadow-sm border border-gray-100 flex items-center justify-between gap-10 mx-2"
                    >
                      <div className="pr-6">
                        <h3 className="text-2xl font-bold text-[#0F3D3E]">
                          {lesson.title}
                        </h3>

                        <p className="mt-3 text-gray-500 break-all">
                          Video URL: {lesson.video_url}
                        </p>
                      </div>

                      <div className="flex gap-4 shrink-0">
                        <button
                          onClick={() => editLesson(lesson)}
                          className="bg-[#FFD166] hover:bg-[#e8bb52] transition text-white px-6 py-3 rounded-xl font-bold shadow-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteItem(
                              `http://localhost:5000/api/admin/lessons/${lesson.lesson_id}`,
                              "Delete this lesson?",
                            )
                          }
                          className="bg-[#F25F5C] hover:bg-[#d94f4c] transition text-white px-6 py-3 rounded-xl font-bold shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {chapter.quiz && (
                  <div className="mt-12 rounded-3xl bg-[#F8FAFC] p-8">
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <h3 className="text-3xl font-black text-[#0F3D3E]">
                          Chapter Quiz
                        </h3>

                        <p className="mt-3 text-lg text-gray-600">
                          {chapter.quiz.title || "Quiz"}
                        </p>
                      </div>

                      <div className="flex gap-4 shrink-0">
                        <button
                          onClick={() => editQuiz(chapter.quiz)}
                          className="bg-[#FFD166] hover:bg-[#e8bb52] transition text-white px-6 py-3 rounded-xl font-bold shadow-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteItem(
                              `http://localhost:5000/api/admin/quizzes/${chapter.quiz.quiz_id}`,
                              "Delete this quiz?",
                            )
                          }
                          className="bg-[#F25F5C] hover:bg-[#d94f4c] transition text-white px-6 py-3 rounded-xl font-bold shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
