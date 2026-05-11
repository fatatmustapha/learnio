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
  image_url: string | null;
  category_name: string;
};

type Kid = {
  kid_id: number;
  child_name?: string;
  username: string;
};

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [openChapter, setOpenChapter] = useState<number | null>(null);

  const [kids, setKids] = useState<Kid[]>([]);
  const [selectedKidId, setSelectedKidId] = useState("");
  const [showKidPicker, setShowKidPicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

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

  const getImageUrl = (img: string | null) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  const selectedKid = kids.find(
    (kid) => String(kid.kid_id) === String(selectedKidId)
  );

  const enrollCourseForKid = async (kidId: number, redirectPath: string) => {
    if (!course) return;

    setEnrolling(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kid_id: kidId,
          course_id: course.course_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Enrollment failed.");
        return;
      }

      setMessage("Course assigned successfully!");

      setTimeout(() => {
        router.push(redirectPath);
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage("Server error. Try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const handleEnroll = async () => {
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userRaw) {
      router.push("/signup");
      return;
    }

    const user = JSON.parse(userRaw);

    if (user.role === "kid") {
      await enrollCourseForKid(user.kid_id, "/kid/dashboard");
      return;
    }

    if (user.role === "parent") {
      if (!token) {
        router.push("/login/parent");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/parent/kids/${user.parent_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Could not load children.");
          return;
        }

        setKids(Array.isArray(data) ? data : []);
        setShowKidPicker(true);
      } catch (error) {
        console.error(error);
        setMessage("Could not load children.");
      }

      return;
    }

    router.push("/signup");
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

  const chapterXP = chapters.length > 0 ? Math.round(50 / chapters.length) : 0;

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
        <section className="bg-white rounded-[32px] shadow-md border border-gray-100 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-[430px] overflow-hidden">
              <img
                src={getImageUrl(course.image_url)}
                alt={course.title}
                className="object-cover w-full h-full"
              />
            </div>

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
                    <p className="text-lg text-gray-600">{chapters.length}</p>
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
                disabled={enrolling}
                className="w-full bg-[#FFD166] hover:bg-[#e6ba56] transition-all duration-300 text-[#0F3D3E] font-bold py-4 rounded-2xl text-lg shadow-sm hover:shadow-md disabled:opacity-60"
              >
                {enrolling ? "Processing..." : "Enroll Now"}
              </button>

              {message && (
                <p className="mt-4 text-center font-medium text-[#0F3D3E]">
                  {message}
                </p>
              )}
            </div>
          </div>
        </section>

        {showKidPicker && (
          <section className="p-6 mb-10 bg-white border border-[#FFE7A8] shadow-sm rounded-3xl">
            <h2 className="mb-2 text-2xl font-bold text-[#0F3D3E]">
              Choose Child
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Select which child should receive this course.
            </p>

            {kids.length === 0 ? (
              <p className="text-gray-500">
                You do not have any children yet. Add a child first.
              </p>
            ) : (
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="
                      w-full
                      px-5 py-4 pr-12
                      rounded-2xl
                      border border-[#FFE1A3]
                      bg-[#FFF9E8]
                      text-[#0F3D3E]
                      font-semibold
                      shadow-sm
                      outline-none
                      transition-all duration-300
                      hover:bg-[#FFF4D6]
                      focus:ring-4 focus:ring-[#FFD166]/30
                      focus:border-[#FFD166]
                      cursor-pointer
                      text-left
                    "
                  >
                    {selectedKid
                      ? selectedKid.child_name || selectedKid.username
                      : "Select a child"}

                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#B88700] text-lg">
                      {dropdownOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-40 w-full mt-2 overflow-hidden bg-[#FFF9E8] border border-[#FFE1A3] rounded-2xl shadow-lg">
                      {kids.map((kid) => (
                        <button
                          key={kid.kid_id}
                          type="button"
                          onClick={() => {
                            setSelectedKidId(String(kid.kid_id));
                            setDropdownOpen(false);
                          }}
                          className={`
                            w-full text-left px-5 py-3
                            font-semibold
                            transition-all duration-200
                            ${
                              String(kid.kid_id) === String(selectedKidId)
                                ? "bg-[#FFD166] text-[#0F3D3E]"
                                : "bg-[#FFF9E8] text-[#0F3D3E] hover:bg-[#FFE7A8]"
                            }
                          `}
                        >
                          {kid.child_name || kid.username}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!selectedKidId) {
                      setMessage("Please select a child first.");
                      return;
                    }

                    enrollCourseForKid(Number(selectedKidId), "/parent/dashboard");
                  }}
                  disabled={enrolling}
                  className="px-6 py-4 bg-[#FFD166] hover:bg-[#e6ba56] text-[#0F3D3E] font-bold rounded-2xl transition disabled:opacity-60"
                >
                  {enrolling ? "Assigning..." : "Assign Course"}
                </button>
              </div>
            )}
          </section>
        )}

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
                    <button
                      onClick={() =>
                        setOpenChapter(isOpen ? null : chapter.chapter_id)
                      }
                      className="w-full bg-[#E8F7F6] hover:bg-[#d7efed] transition-all duration-300 px-8 py-6 flex items-center justify-between text-left"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-[#0F3D3E]">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </h3>

                        <p className="text-sm text-[#0F3D3E]/70 mt-1">
                          {chapter.lessons.length} lessons + quiz • {chapterXP}{" "}
                          XP
                        </p>
                      </div>

                      <div className="text-3xl text-[#0F3D3E]">
                        {isOpen ? "−" : "+"}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-8 py-6 space-y-4 bg-white">
                        {chapter.lessons.map((lesson, lessonIndex) => {
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
                                    Lesson {lessonIndex + 1}: {lesson.title}
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