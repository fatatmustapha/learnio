"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCoursePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    image_url: "",
    badge_name: "",
    badge_icon: "",
  });

  const [courseImage, setCourseImage] = useState<File | null>(null);

  const [chapters, setChapters] = useState([
    {
      title: "",
      lessons: [
        {
          title: "",
          content: "",
          video_url: "",
        },
      ],
      quiz: {
        title: "",
        questions: [
          {
            question_text: "",
            option_a: "",
            option_b: "",
            option_c: "",
            option_d: "",
            correct_option: "A",
          },
        ],
      },
    },
  ]);

  const handleCourseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        title: "",
        lessons: [
          {
            title: "",
            content: "",
            video_url: "",
          },
        ],
        quiz: {
          title: "",
          questions: [
            {
              question_text: "",
              option_a: "",
              option_b: "",
              option_c: "",
              option_d: "",
              correct_option: "A",
            },
          ],
        },
      },
    ]);
  };

  const handleChapterTitle = (index: number, value: string) => {
    const updated = [...chapters];
    updated[index].title = value;
    setChapters(updated);
  };

  const addLesson = (chapterIndex: number) => {
    const updated = [...chapters];

    updated[chapterIndex].lessons.push({
      title: "",
      content: "",
      video_url: "",
    });

    setChapters(updated);
  };

  const handleLessonChange = (
    chapterIndex: number,
    lessonIndex: number,
    field: string,
    value: string,
  ) => {
    const updated = [...chapters];

    updated[chapterIndex].lessons[lessonIndex][field] = value;

    setChapters(updated);
  };

  const addQuestion = (chapterIndex: number) => {
    const updated = [...chapters];

    updated[chapterIndex].quiz.questions.push({
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_option: "A",
    });

    setChapters(updated);
  };

  const handleQuestionChange = (
    chapterIndex: number,
    questionIndex: number,
    field: string,
    value: string,
  ) => {
    const updated = [...chapters];

    updated[chapterIndex].quiz.questions[questionIndex][field] = value;

    setChapters(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let uploadedImageUrl = "";

if (courseImage) {
  const formData = new FormData();
  formData.append("image", courseImage);

  const uploadRes = await fetch(
    "http://localhost:5000/api/admin/upload-image",
    {
      method: "POST",
      body: formData,
    }
  );

  const uploadData = await uploadRes.json();
  uploadedImageUrl = uploadData.image_url;
}

      const res = await fetch(
        "http://localhost:5000/api/admin/courses/full-create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...courseData,
image_url: uploadedImageUrl,
            chapters,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Course created successfully");

      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold text-[#0F3D3E]">Create Course</h1>

            <p className="mt-3 text-lg text-gray-600">
              Add courses, chapters, lessons, quizzes, and badges.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#FFD166] hover:bg-[#e8bb52] transition px-8 py-4 rounded-2xl text-white font-bold shadow-lg"
          >
            {loading ? "Publishing..." : "Publish Course"}
          </button>
        </div>

        <div className="p-8 mb-10 bg-white shadow-lg rounded-3xl">
          <h2 className="text-3xl font-bold text-[#0F3D3E] mb-8">
            Course Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={courseData.title}
              onChange={handleCourseChange}
              className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={courseData.category}
              onChange={handleCourseChange}
              className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
            />

           <input
  type="file"
  accept="image/*"
  onChange={(e) => setCourseImage(e.target.files?.[0] || null)}
  className="px-5 py-4 border border-gray-300 outline-none rounded-xl md:col-span-2"
/>
            <textarea
              name="description"
              placeholder="Course Description"
              value={courseData.description}
              onChange={handleCourseChange}
              rows={5}
              className="px-5 py-4 border border-gray-300 outline-none rounded-xl md:col-span-2"
            />
            <input
              type="text"
              name="badge_name"
              placeholder="Badge Name"
              value={courseData.badge_name}
              onChange={handleCourseChange}
              className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
            />

            <input
              type="text"
              name="badge_icon"
              placeholder="Badge Icon URL"
              value={courseData.badge_icon}
              onChange={handleCourseChange}
              className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
            />
          </div>
        </div>

        {chapters.map((chapter, chapterIndex) => (
          <div
            key={chapterIndex}
            className="p-8 mb-10 bg-white shadow-lg rounded-3xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#0F3D3E]">
                Chapter {chapterIndex + 1}
              </h2>

              <button
                onClick={() => addLesson(chapterIndex)}
                className="bg-[#2EC4B6] hover:bg-[#24a89c] transition text-white px-5 py-3 rounded-xl font-semibold"
              >
                + Add Lesson
              </button>
            </div>

            <input
              type="text"
              placeholder="Chapter Title"
              value={chapter.title}
              onChange={(e) => handleChapterTitle(chapterIndex, e.target.value)}
              className="w-full px-5 py-4 mb-8 border border-gray-300 outline-none rounded-xl"
            />

            {chapter.lessons.map((lesson, lessonIndex) => (
              <div
                key={lessonIndex}
                className="p-6 mb-6 border border-gray-200 rounded-2xl"
              >
                <h3 className="text-xl font-bold mb-4 text-[#0F3D3E]">
                  Lesson {lessonIndex + 1}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={(e) =>
                      handleLessonChange(
                        chapterIndex,
                        lessonIndex,
                        "title",
                        e.target.value,
                      )
                    }
                    className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                  />

                  <textarea
                    placeholder="Lesson Content"
                    rows={4}
                    value={lesson.content}
                    onChange={(e) =>
                      handleLessonChange(
                        chapterIndex,
                        lessonIndex,
                        "content",
                        e.target.value,
                      )
                    }
                    className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                  />

                  <input
                    type="text"
                    placeholder="Video URL"
                    value={lesson.video_url}
                    onChange={(e) =>
                      handleLessonChange(
                        chapterIndex,
                        lessonIndex,
                        "video_url",
                        e.target.value,
                      )
                    }
                    className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                  />
                </div>
              </div>
            ))}

            <div className="mt-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-[#0F3D3E]">
                  Chapter Quiz
                </h3>

                <button
                  onClick={() => addQuestion(chapterIndex)}
                  className="bg-[#FFD166] hover:bg-[#e8bb52] transition text-white px-5 py-3 rounded-xl font-semibold"
                >
                  + Add Question
                </button>
              </div>

              <input
                type="text"
                placeholder="Quiz Title"
                value={chapter.quiz.title}
                onChange={(e) => {
                  const updated = [...chapters];
                  updated[chapterIndex].quiz.title = e.target.value;
                  setChapters(updated);
                }}
                className="w-full px-5 py-4 mb-6 border border-gray-300 outline-none rounded-xl"
              />

              {chapter.quiz.questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="p-6 mb-6 border border-gray-200 rounded-2xl"
                >
                  <h4 className="text-xl font-bold mb-4 text-[#0F3D3E]">
                    Question {questionIndex + 1}
                  </h4>

                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Question"
                      value={question.question_text}
                      onChange={(e) =>
                        handleQuestionChange(
                          chapterIndex,
                          questionIndex,
                          "question_text",
                          e.target.value,
                        )
                      }
                      className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                    />

                    <input
                      type="text"
                      placeholder="Option A"
                      value={question.option_a}
                      onChange={(e) =>
                        handleQuestionChange(
                          chapterIndex,
                          questionIndex,
                          "option_a",
                          e.target.value,
                        )
                      }
                      className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                    />

                    <input
                      type="text"
                      placeholder="Option B"
                      value={question.option_b}
                      onChange={(e) =>
                        handleQuestionChange(
                          chapterIndex,
                          questionIndex,
                          "option_b",
                          e.target.value,
                        )
                      }
                      className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                    />

                    <input
                      type="text"
                      placeholder="Option C"
                      value={question.option_c}
                      onChange={(e) =>
                        handleQuestionChange(
                          chapterIndex,
                          questionIndex,
                          "option_c",
                          e.target.value,
                        )
                      }
                      className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                    />

                    <input
                      type="text"
                      placeholder="Option D"
                      value={question.option_d}
                      onChange={(e) =>
                        handleQuestionChange(
                          chapterIndex,
                          questionIndex,
                          "option_d",
                          e.target.value,
                        )
                      }
                      className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                    />

                    <select
                      value={question.correct_option}
                      onChange={(e) =>
                        handleQuestionChange(
                          chapterIndex,
                          questionIndex,
                          "correct_option",
                          e.target.value,
                        )
                      }
                      className="px-5 py-4 border border-gray-300 outline-none rounded-xl"
                    >
                      <option value="A">Correct Answer: A</option>
                      <option value="B">Correct Answer: B</option>
                      <option value="C">Correct Answer: C</option>
                      <option value="D">Correct Answer: D</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-8 mt-12 mb-16">
          <button
            onClick={addChapter}
            className="w-full bg-[#2EC4B6] hover:bg-[#24a89c] transition text-white py-5 rounded-2xl text-xl font-bold shadow-lg"
          >
            + Add New Chapter
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#FFD166] hover:bg-[#e8bb52] transition text-white py-5 rounded-2xl text-xl font-bold shadow-lg disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish Course"}
          </button>
        </div>
      </div>
    </main>
  );
}
