"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Lesson = {
  lesson_id: number;
  title: string;
  content: string;
  xp_reward: number;
};

type Chapter = {
  chapter_id: number;
  title: string;
  xp_total: number;
  lessons: Lesson[];
};

type Course = {
  course_id: number;
  title: string;
  description: string;
  image_url: string;
  category_name: string;
};

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [openChapter, setOpenChapter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/courses/${params.id}/details`
        );

        const data = await res.json();

        setCourse(data.course);
        setChapters(data.chapters || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [params.id]);

  const handleEnroll = () => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    alert("Enrollment system will be added later.");
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-40 bg-[#F8FAFC]">
        <h1 className="text-center text-2xl font-semibold text-[#0F3D3E]">
          Loading...
        </h1>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen pt-40 bg-[#F8FAFC]">
        <h1 className="text-2xl font-semibold text-center text-red-500">
          Course not found.
        </h1>
      </main>
    );
  }

  const chapterXP =
    chapters.length > 0 ? Math.round(50 / chapters.length) : 0;

  const getLessonXP = (lessonsCount: number) => {
    if (lessonsCount === 0) return 0;
    return Math.round((chapterXP * 0.7) / lessonsCount);
  };

  const getQuizXP = () => {
    return Math.round(chapterXP * 0.3);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* TOP CARD */}
        <section className="bg-white rounded-[32px] shadow-md border border-gray-100 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* IMAGE */}
            <div className="h-[430px] overflow-hidden">
              <img
                src={`http://localhost:5000${course.image_url}`}
                alt={course.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-between p-10">
              <div>
                <span className="inline-block bg-[#FFD166]/25 text-[#B88700] px-4 py-1 rounded-full text-sm font-semibold mb-5">
                  {course.category_name}
                </span>

                <h1 className="text-4xl font-bold text-[#0F3D3E] leading-tight mb-5">
                  {course.title}
                </h1>

                <p className="text-gray-600 leading-relaxed text-[16px] mb-8">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#FFF4D8] rounded-2xl p-4">
                    <p className="text-sm font-semibold text-[#0F3D3E]">
                      Total Chapters
                    </p>

                    <p className="text-lg text-gray-600">
                      {chapters.length}
                    </p>
                  </div>

                  <div className="bg-[#E8F7F6] rounded-2xl p-4">
                    <p className="text-sm font-semibold text-[#0F3D3E]">
                      Total XP
                    </p>

                    <p className="text-lg text-gray-600">50 XP</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleEnroll}
                className="w-full bg-[#FFD166] hover:bg-[#e6ba56] transition-all duration-300 text-[#0F3D3E] font-bold py-4 rounded-2xl text-lg shadow-sm hover:shadow-md"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </section>

        {/* COURSE CONTENT */}
        <section>
          <h2 className="text-3xl font-bold text-[#0F3D3E] mb-6">
            Course Content
          </h2>

          {chapters.length === 0 ? (
            <div className="p-10 text-center bg-white border shadow-sm rounded-3xl">
              <p className="text-gray-500">Course content coming soon.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {chapters.map((chapter, chapterIndex) => {
                const isOpen = openChapter === chapter.chapter_id;

                const lessonXP = getLessonXP(chapter.lessons.length);

                const quizXP = getQuizXP();

                return (
                  <div
                    key={chapter.chapter_id}
                    className="overflow-hidden bg-white border border-gray-100 shadow-md rounded-3xl"
                  >
                    {/* CHAPTER HEADER */}
                    <button
                      onClick={() =>
                        setOpenChapter(
                          isOpen ? null : chapter.chapter_id
                        )
                      }
                      className="w-full bg-[#E8F7F6] hover:bg-[#d7efed] transition-all duration-300 px-8 py-6 flex items-center justify-between text-left"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-[#0F3D3E]">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </h3>

                        <p className="text-sm text-[#0F3D3E]/70 mt-1">
                          {chapter.lessons.length} lessons + quiz •{" "}
                          {chapterXP} XP
                        </p>
                      </div>

                      <div className="text-3xl text-[#0F3D3E]">
                        {isOpen ? "−" : "+"}
                      </div>
                    </button>

                    {/* DROPDOWN CONTENT */}
                    {isOpen && (
                      <div className="px-8 py-6 space-y-4 bg-white">
                        {chapter.lessons.map((lesson, lessonIndex) => {
                          // ONLY Chapter 1 Lesson 1 & 2 unlocked
                          const isUnlocked =
                            chapterIndex === 0 && lessonIndex < 2;

                          return (
                            <div
                              key={lesson.lesson_id}
                              className={`flex items-center justify-between border rounded-2xl p-5 transition-all ${
                                isUnlocked
                                  ? "bg-[#F8FAFC] border-gray-200"
                                  : "bg-gray-100 border-gray-200 opacity-70"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold ${
                                    isUnlocked
                                      ? "bg-[#FFD166] text-[#0F3D3E]"
                                      : "bg-gray-300 text-gray-600"
                                  }`}
                                >
                                  {isUnlocked ? "▶" : "🔒"}
                                </div>

                                <div>
                                  <h4 className="font-semibold text-[#0F3D3E] text-lg">
                                    Lesson {lessonIndex + 1}:{" "}
                                    {lesson.title}
                                  </h4>

                                  <p className="mt-1 text-sm text-gray-500">
                                    {lessonXP} XP
                                  </p>
                                </div>
                              </div>

                              <button
                                disabled={!isUnlocked}
                                className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                                  isUnlocked
                                    ? "bg-[#FFD166] hover:bg-[#e6ba56] text-[#0F3D3E]"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                {isUnlocked ? "Preview" : "Locked"}
                              </button>
                            </div>
                          );
                        })}

                        {/* QUIZ CARD */}
                        <div className="flex items-center justify-between p-5 bg-gray-100 border border-gray-200 rounded-2xl opacity-70">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center text-lg font-bold text-gray-600 bg-gray-300 rounded-full w-11 h-11">
                              🔒
                            </div>

                            <div>
                              <h4 className="font-semibold text-[#0F3D3E] text-lg">
                                Chapter Quiz
                              </h4>

                              <p className="mt-1 text-sm text-gray-500">
                                {quizXP} XP
                              </p>
                            </div>
                          </div>

                          <button
                            disabled
                            className="px-5 py-2 font-semibold text-gray-500 bg-gray-300 cursor-not-allowed rounded-xl"
                          >
                            Locked
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}