"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Lesson = {
  lesson_id: number;
  title: string;
  content: string;
  video_url: string | null;
  lesson_order: number;
  chapter_id: number;
  course_id: number;
  course_title: string;
  chapter_title: string;
  chapter_order: number;
};

type CourseLesson = {
  lesson_id: number;
  lesson_order: number;
  chapter_id: number;
};

type CourseChapter = {
  chapter_id: number;
  chapter_order: number;
  lessons: CourseLesson[];
  quiz: { quiz_id: number } | null;
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [chapters, setChapters] = useState<CourseChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const lessonId = params.id;

  const fetchLesson = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not load lesson.");
        return;
      }

      setLesson(data);

      const courseRes = await fetch(
        `http://localhost:5000/api/courses/${data.course_id}/details`
      );

      const courseData = await courseRes.json();

      if (courseRes.ok) {
        setChapters(courseData.chapters || []);
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not load lesson.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const saveWatchedLessonLocal = (lessonData: Lesson) => {
    const userRaw = localStorage.getItem("user");

    if (!userRaw) return;

    const user = JSON.parse(userRaw);
    const key = `watched_lessons_${user.kid_id}_${lessonData.course_id}`;

    const existingRaw = localStorage.getItem(key);
    const existing: number[] = existingRaw ? JSON.parse(existingRaw) : [];

    const updated = [...new Set([...existing, lessonData.lesson_id])];

    localStorage.setItem(key, JSON.stringify(updated));
  };

  const completeLesson = async () => {
    if (!lesson || completed) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/lessons/${lesson.lesson_id}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not complete lesson.");
        return;
      }

      saveWatchedLessonLocal(lesson);
      setCompleted(true);
      setMessage("Lesson completed! You can continue.");
    } catch (error) {
      console.error(error);
      setMessage("Could not complete lesson.");
    }
  };

  const getNextLesson = () => {
    if (!lesson) return null;

    const sortedChapters = [...chapters].sort(
      (a, b) => a.chapter_order - b.chapter_order
    );

    const flatLessons = sortedChapters.flatMap((chapter) =>
      [...chapter.lessons]
        .sort((a, b) => a.lesson_order - b.lesson_order)
        .map((lessonItem) => ({
          ...lessonItem,
          chapter_order: chapter.chapter_order,
        }))
    );

    const currentIndex = flatLessons.findIndex(
      (item) => Number(item.lesson_id) === Number(lesson.lesson_id)
    );

    if (currentIndex === -1) return null;

    return flatLessons[currentIndex + 1] || null;
  };

  const goNext = async () => {
    await completeLesson();

    const nextLesson = getNextLesson();

    if (nextLesson) {
      router.push(`/lesson/${nextLesson.lesson_id}`);
      return;
    }

    if (lesson) {
      router.push(`/courses/${lesson.course_id}?openChapter=${lesson.chapter_id}`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] pt-36 px-6">
        <p className="text-center text-gray-500">Loading lesson...</p>
      </main>
    );
  }

  if (!lesson) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] pt-36 px-6">
        <p className="text-center text-red-500">
          {message || "Lesson not found."}
        </p>
      </main>
    );
  }

  const nextLesson = getNextLesson();

  return (
    <main className="min-h-screen bg-[#FDF8F3] pt-32 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push(`/courses/${lesson.course_id}`)}
          className="mb-6 text-[#0F3D3E] font-bold hover:underline"
        >
          ← Back to Course
        </button>

        <section className="bg-white rounded-[32px] shadow-md overflow-hidden border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <p className="text-sm font-semibold text-[#B88700] mb-2">
              Chapter {lesson.chapter_order}: {lesson.chapter_title}
            </p>

            <h1 className="text-4xl font-bold text-[#0F3D3E]">
              {lesson.title}
            </h1>

            <p className="mt-3 text-gray-500">{lesson.course_title}</p>
          </div>

          <div className="p-8">
            {lesson.video_url ? (
              <video
                controls
                className="w-full bg-black shadow-sm rounded-3xl"
                onEnded={completeLesson}
              >
                <source
                  src={`http://localhost:5000${lesson.video_url}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="bg-[#FFF4D8] rounded-3xl p-10 text-center text-[#0F3D3E] font-semibold">
                No video has been added for this lesson yet.
              </div>
            )}

            <div className="mt-8 bg-[#F8FAFC] rounded-3xl p-6">
              <h2 className="text-2xl font-bold text-[#0F3D3E] mb-3">
                Lesson Summary
              </h2>

              <p className="leading-relaxed text-gray-600">{lesson.content}</p>
            </div>

            {message && (
              <p className="mt-6 text-center font-semibold text-[#0F3D3E]">
                {message}
              </p>
            )}

            <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
              <button
                onClick={completeLesson}
                disabled={completed}
                className={`px-8 py-4 rounded-2xl font-bold transition ${
                  completed
                    ? "bg-[#DCFCE7] text-[#166534]"
                    : "bg-[#FFD166] hover:bg-[#e6ba56] text-[#0F3D3E]"
                }`}
              >
                {completed ? "Lesson Completed ✓" : "Mark as Completed"}
              </button>

              <button
                onClick={goNext}
                className="px-8 py-4 rounded-2xl font-bold bg-[#0F3D3E] text-white hover:scale-105 transition"
              >
                {nextLesson ? "Next Lesson →" : "Take Quiz →"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}