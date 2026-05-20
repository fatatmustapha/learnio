"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type Lesson = {
  lesson_id: number;
  title: string;
  content: string;
  xp_reward: number;
  lesson_order: number;
  video_url?: string | null;
};

type Quiz = {
  quiz_id: number;
  title: string;
  xp_reward: number;
  passing_score: number;
};

type QuizQuestion = {
  question_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

type Chapter = {
  chapter_id: number;
  title: string;
  xp_total: number;
  chapter_order: number;
  lessons: Lesson[];
  quiz: Quiz | null;
};

type Course = {
  course_id: number;
  title: string;
  description: string;
  image_url: string | null;
  category_name: string;
};

type User = {
  role: "kid" | "parent" | "admin";
  kid_id?: number;
  parent_id?: number;
};

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = params.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [openChapter, setOpenChapter] = useState<number | null>(null);

  const [watchedLessons, setWatchedLessons] = useState<number[]>([]);
  const [passedChapterIds, setPassedChapterIds] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const [activeQuizChapterId, setActiveQuizChapterId] = useState<number | null>(
    null
  );
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [quizLoading, setQuizLoading] = useState(false);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");

    if (userRaw) {
      const parsedUser = JSON.parse(userRaw);
      setUser(parsedUser);

      if (parsedUser.role === "kid") {
        checkEnrollment(parsedUser.kid_id);
      }
    }

    const open = searchParams.get("openChapter");

    if (open) {
      setOpenChapter(Number(open));
    }

    fetchCourse();
    fetchQuizStatus();
    loadWatchedLessons();
  }, []);

  const fetchCourse = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/${courseId}/details`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Course not found");
      }

      setCourse(data.course);
      setChapters(data.chapters || []);
    } catch (error) {
      console.error(error);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch(
        `http://localhost:5000/api/quiz/course-status/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPassedChapterIds(data.passedChapterIds || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkEnrollment = async (kidId?: number) => {
    if (!kidId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/kid/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return;

      const courses = data.courses || [];

      const found = courses.some(
        (item: any) => Number(item.course_id) === Number(courseId)
      );

      setIsEnrolled(found);
    } catch (error) {
      console.error(error);
    }
  };

  const enrollNow = async () => {
    const userRaw = localStorage.getItem("user");

    if (!userRaw) {
      router.push("/signup");
      return;
    }

    const currentUser = JSON.parse(userRaw);

    if (currentUser.role !== "kid") {
      setMessage("Only a kid account can enroll directly from this page.");
      return;
    }

    if (isEnrolled) {
      setMessage("Course already enrolled.");
      return;
    }

    try {
      setEnrolling(true);
      setMessage("");

      const res = await fetch("http://localhost:5000/api/courses/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kid_id: currentUser.kid_id,
          course_id: Number(courseId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Course already enrolled.");
        setIsEnrolled(true);
        return;
      }

      setIsEnrolled(true);
      setMessage("Course enrolled successfully! It will now appear on your dashboard.");
    } catch (error) {
      console.error(error);
      setMessage("Could not enroll course.");
    } finally {
      setEnrolling(false);
    }
  };

  const loadWatchedLessons = () => {
    const userRaw = localStorage.getItem("user");

    if (!userRaw) return;

    const currentUser = JSON.parse(userRaw);
    const key = `watched_lessons_${currentUser.kid_id || "guest"}_${courseId}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      setWatchedLessons(JSON.parse(saved));
    }
  };

  const getImageUrl = (img: string | null) => {
    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  const isLessonLocked = (chapterIndex: number, lessonIndex: number) => {
    if (chapterIndex === 0 && lessonIndex === 0) return false;

    const currentChapter = chapters[chapterIndex];

    if (!currentChapter) return true;

    if (lessonIndex > 0) {
      const previousLesson = currentChapter.lessons[lessonIndex - 1];
      return !watchedLessons.includes(previousLesson.lesson_id);
    }

    const previousChapter = chapters[chapterIndex - 1];

    if (!previousChapter) return true;

    return !passedChapterIds.includes(previousChapter.chapter_id);
  };

  const isQuizLocked = (chapter: Chapter) => {
    if (chapter.lessons.length === 0) return true;

    return !chapter.lessons.every((lesson) =>
      watchedLessons.includes(lesson.lesson_id)
    );
  };

  const getChapterXp = () => {
    if (chapters.length === 0) return 0;
    return 50 / chapters.length;
  };

  const getLessonXp = (chapter: Chapter) => {
    if (chapter.lessons.length === 0) return 0;
    return (getChapterXp() * 0.6) / chapter.lessons.length;
  };

  const getQuizXp = () => {
    return getChapterXp() * 0.4;
  };

  const openQuiz = async (chapter: Chapter) => {
    if (!chapter.quiz) return;

    if (isQuizLocked(chapter)) {
      setMessage("Please watch all lessons in this chapter before taking the quiz.");
      return;
    }

    try {
      setQuizLoading(true);
      setMessage("");
      setQuizResult(null);
      setSelectedAnswers({});

      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/quiz/chapter/${chapter.chapter_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not load quiz.");
        return;
      }

      setQuizData(data.quiz);
      setQuizQuestions(data.questions || []);
      setActiveQuizChapterId(chapter.chapter_id);
    } catch (error) {
      console.error(error);
      setMessage("Could not load quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!quizData) return;

    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
      setMessage("Please answer all questions before submitting.");
      return;
    }

    try {
      setQuizLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const answers = Object.entries(selectedAnswers).map(
        ([question_id, selected_option]) => ({
          question_id: Number(question_id),
          selected_option,
        })
      );

      const res = await fetch("http://localhost:5000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz_id: quizData.quiz_id,
          answers,
        }),
      });

      const data = await res.json();

      setQuizResult(data);

      if (data.passed && activeQuizChapterId) {
        setPassedChapterIds((prev) => [
          ...new Set([...prev, activeQuizChapterId]),
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not submit quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] pt-36">
        <p className="text-center text-gray-500">Loading course...</p>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-[#FDF8F3] pt-36">
        <p className="text-center text-red-500">Course not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF8F3] pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <section className="bg-white rounded-[32px] shadow-md border border-gray-100 overflow-hidden mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="h-[420px] overflow-hidden">
              <img
                src={getImageUrl(course.image_url)}
                alt={course.title}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex flex-col justify-center p-10">
              <span className="inline-block bg-[#FFD166]/25 text-[#B88700] px-4 py-1 rounded-full text-sm font-semibold mb-5 w-fit">
                {course.category_name}
              </span>

              <h1 className="text-4xl font-bold text-[#0F3D3E] mb-5">
                {course.title}
              </h1>

              <p className="mb-8 leading-relaxed text-gray-600">
                {course.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FFF4D8] rounded-2xl p-4">
                  <p className="text-sm font-semibold text-[#0F3D3E]">
                    Chapters
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

              <button
                onClick={enrollNow}
                disabled={enrolling || isEnrolled}
                className={`mt-8 w-full transition text-[#0F3D3E] font-bold py-4 rounded-2xl ${
                  isEnrolled
                    ? "bg-[#DCFCE7] text-[#166534] cursor-not-allowed"
                    : "bg-[#FFD166] hover:bg-[#e6ba56]"
                }`}
              >
                {isEnrolled
                  ? "Enrolled ✓"
                  : enrolling
                  ? "Enrolling..."
                  : "Enroll Now"}
              </button>

              {isEnrolled && (
                <p className="mt-3 text-center text-sm font-semibold text-[#166534]">
                  Course already enrolled.
                </p>
              )}

              {message && (
                <p className="mt-4 text-center font-semibold text-[#0F3D3E]">
                  {message}
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-[#0F3D3E] mb-6">
            Course Content
          </h2>

          <div className="space-y-5">
            {chapters.map((chapter, chapterIndex) => {
              const isOpen = openChapter === chapter.chapter_id;
              const quizLocked = isQuizLocked(chapter);
              const chapterPassed = passedChapterIds.includes(
                chapter.chapter_id
              );
              const lessonXp = getLessonXp(chapter);
              const quizXp = getQuizXp();

              return (
                <div
                  key={chapter.chapter_id}
                  className="overflow-hidden bg-white border border-gray-100 shadow-md rounded-3xl"
                >
                  <button
                    onClick={() =>
                      setOpenChapter(isOpen ? null : chapter.chapter_id)
                    }
                    className="w-full bg-[#E8F7F6] hover:bg-[#d7efed] px-8 py-6 flex items-center justify-between text-left transition"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-[#0F3D3E]">
                        Chapter {chapterIndex + 1}: {chapter.title}
                      </h3>

                      <p className="text-sm text-[#0F3D3E]/70 mt-1">
                        {chapter.lessons.length} lessons + quiz •{" "}
                        {getChapterXp().toFixed(2)} XP
                      </p>
                    </div>

                    <div className="text-3xl text-[#0F3D3E]">
                      {chapterPassed ? "✓" : isOpen ? "−" : "+"}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-8 py-6 space-y-4 bg-white">
                      {chapter.lessons.map((lesson, lessonIndex) => {
                        const locked = isLessonLocked(
                          chapterIndex,
                          lessonIndex
                        );

                        const watched = watchedLessons.includes(
                          lesson.lesson_id
                        );

                        return (
                          <div
                            key={lesson.lesson_id}
                            className={`flex items-center justify-between border rounded-2xl p-5 ${
                              locked
                                ? "bg-gray-100 border-gray-200 opacity-70"
                                : watched
                                ? "bg-[#ECFDF5] border-[#A7F3D0]"
                                : "bg-[#F8FAFC] border-gray-100"
                            }`}
                          >
                            <div>
                              <h4 className="font-semibold text-[#0F3D3E] text-lg">
                                Lesson {lessonIndex + 1}: {lesson.title}
                              </h4>

                              <p className="mt-1 text-sm text-gray-500">
                                {lessonXp.toFixed(2)} XP
                              </p>
                            </div>

                            <button
                              disabled={locked}
                              onClick={() =>
                                router.push(`/lesson/${lesson.lesson_id}`)
                              }
                              className={`px-5 py-2 rounded-xl font-semibold transition ${
                                locked
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : watched
                                  ? "bg-[#22C55E] text-white hover:bg-[#16A34A]"
                                  : "bg-[#FFD166] hover:bg-[#e6ba56] text-[#0F3D3E]"
                              }`}
                            >
                              {locked ? "Locked" : watched ? "Watched ✓" : "Watch"}
                            </button>
                          </div>
                        );
                      })}

                      {chapter.quiz && (
                        <div
                          className={`mt-6 border rounded-3xl p-6 ${
                            quizLocked
                              ? "bg-gray-100 border-gray-200 opacity-70"
                              : "bg-[#FFF9E8] border-[#FFE1A3]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-[#0F3D3E]">
                                Chapter Quiz
                              </h4>

                              <p className="text-sm text-gray-500">
                                Watch all lessons in this chapter to unlock.
                              </p>
                            </div>

                            <span className="bg-white text-[#B88700] px-4 py-2 rounded-full font-bold">
                              {quizXp.toFixed(2)} XP
                            </span>
                          </div>

                          <button
                            disabled={quizLocked || quizLoading}
                            onClick={() => openQuiz(chapter)}
                            className={`px-6 py-3 rounded-2xl font-bold transition ${
                              quizLocked
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#FFD166] hover:bg-[#e6ba56] text-[#0F3D3E]"
                            }`}
                          >
                            {quizLocked ? "Locked" : "Start Quiz"}
                          </button>

                          {activeQuizChapterId === chapter.chapter_id && (
                            <div className="mt-8 space-y-5">
                              {quizQuestions.map((question, index) => (
                                <div
                                  key={question.question_id}
                                  className="p-6 bg-white border border-gray-100 rounded-2xl"
                                >
                                  <h4 className="text-lg font-bold text-[#0F3D3E] mb-4">
                                    {index + 1}. {question.question_text}
                                  </h4>

                                  <div className="space-y-3">
                                    {[
                                      { key: "A", value: question.option_a },
                                      { key: "B", value: question.option_b },
                                      { key: "C", value: question.option_c },
                                      { key: "D", value: question.option_d },
                                    ].map((option) => (
                                      <button
                                        key={option.key}
                                        onClick={() =>
                                          setSelectedAnswers((prev) => ({
                                            ...prev,
                                            [question.question_id]: option.key,
                                          }))
                                        }
                                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition ${
                                          selectedAnswers[
                                            question.question_id
                                          ] === option.key
                                            ? "border-[#FFD166] bg-[#FFF4D8]"
                                            : "border-gray-200 bg-white hover:bg-[#FFF9E8]"
                                        }`}
                                      >
                                        <span className="mr-2 font-bold">
                                          {option.key}.
                                        </span>
                                        {option.value}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              <button
                                onClick={submitQuiz}
                                disabled={quizLoading}
                                className="bg-[#0F3D3E] text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition disabled:opacity-60"
                              >
                                {quizLoading ? "Submitting..." : "Submit Quiz"}
                              </button>

                              {quizResult && (
                                <div
                                  className={`mt-6 rounded-3xl p-6 ${
                                    quizResult.passed
                                      ? "bg-[#DCFCE7]"
                                      : "bg-[#FEE2E2]"
                                  }`}
                                >
                                  <h3 className="text-2xl font-bold text-[#0F3D3E] mb-3">
                                    {quizResult.passed
                                      ? "Quiz Passed 🎉"
                                      : "Quiz Failed"}
                                  </h3>

                                  <p>
                                    Score:{" "}
                                    <strong>
                                      {Math.round(quizResult.score)}%
                                    </strong>
                                  </p>

                                  <p>
                                    Correct Answers:{" "}
                                    <strong>
                                      {quizResult.correctAnswers}/
                                      {quizResult.totalQuestions}
                                    </strong>
                                  </p>

                                  <p>
                                    XP Earned:{" "}
                                    <strong>{quizResult.earnedXp}</strong>
                                  </p>

                                  <p>
                                    Course Progress:{" "}
                                    <strong>
                                      {quizResult.progressPercent}%
                                    </strong>
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}