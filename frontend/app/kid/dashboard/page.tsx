"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
  course_id: number;
  title: string;
  description: string;
  image_url: string | null;
  completed_lessons: number;
  progress_percent: number;
  completed: number;
};

type DashboardData = {
  kid: {
    kid_id: number;
    child_name: string;
    username: string;
    age: number;
    totalXp: number;
    level: number;
    levelProgress: number;
    xpNeededForNextLevel: number;
  };
  stats: {
    enrolledCourses: number;
    completedCourses: number;
  };
  courses: Course[];
};

const getImageUrl = (url: string | null) => {
  if (!url) return "/images/course-money.jpg";
  if (url.startsWith("http")) return url;
  return `http://localhost:5000${url}`;
};

export default function KidDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.push("/login/kid");
      return;
    }

    const user = JSON.parse(userRaw);

    if (user.role !== "kid") {
      router.push("/login/kid");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/kid/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to load dashboard");
        }

        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] pt-36 px-6">
        <p className="text-center text-[#0F3D3E] font-semibold">
          Loading kid dashboard...
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] pt-36 px-6">
        <p className="font-semibold text-center text-red-500">
          Could not load kid dashboard.
        </p>
      </main>
    );
  }

  const totalXP = data.kid.totalXp || 0;
  const level = data.kid.level || 1;
  const xpIntoLevel = data.kid.levelProgress || 0;
  const xpProgress =
    (xpIntoLevel / data.kid.xpNeededForNextLevel) * 100;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-36">
      <div className="px-6 pb-16 mx-auto max-w-7xl">
        <h1 className="text-5xl font-bold text-[#083344] mb-2">
          Kid Dashboard
        </h1>

        <p className="text-xl text-[#475569] mb-10">
          Welcome, {data.kid.child_name || data.kid.username}!
        </p>

        <div className="bg-[#FFF4D6] rounded-[28px] p-6 shadow-sm flex items-center gap-6 mb-10">
          <div className="flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-sm shrink-0">
            <img
              src="/icons/star-icon.png"
              alt="star"
              className="object-contain w-14 h-14"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-4xl font-bold text-[#083344]">
                Level {level}
              </h2>

              <div className="bg-white px-4 py-2 rounded-full text-[#083344] font-bold text-lg shadow-sm">
                {totalXP} XP
              </div>
            </div>

            <div className="w-full h-5 overflow-hidden bg-white rounded-full">
              <div
                className="h-full bg-[#FFD166] rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>

            <p className="mt-3 text-[#475569] text-base">
              {xpIntoLevel}/50 XP to next level
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-12 md:grid-cols-2">
          <div className="bg-white rounded-[24px] p-6 shadow-sm">
            <p className="text-[#64748B] text-lg mb-2">
              Enrolled Courses
            </p>

            <h3 className="text-4xl font-bold text-[#083344]">
              {data.stats.enrolledCourses}
            </h3>
          </div>

          <div className="bg-white rounded-[24px] p-6 shadow-sm">
            <p className="text-[#64748B] text-lg mb-2">
              Completed Courses
            </p>

            <h3 className="text-4xl font-bold text-[#083344]">
              {data.stats.completedCourses}
            </h3>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-[#083344] mb-8">
            My Courses
          </h2>

          {data.courses.length === 0 ? (
            <div className="bg-white rounded-[24px] p-10 text-center text-[#64748B] text-lg shadow-sm">
              No enrolled courses yet.
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {data.courses.map((course) => (
                <div
                  key={course.course_id}
                  className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <img
                    src={getImageUrl(course.image_url)}
                    alt={course.title}
                    className="object-cover w-full h-52"
                  />

                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-[#083344] mb-2">
                      {course.title}
                    </h3>

                    <p className="text-[#64748B] mb-5 text-sm line-clamp-2">
                      {course.description}
                    </p>

                    <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FFD166] rounded-full"
                        style={{ width: `${course.progress_percent || 0}%` }}
                      />
                    </div>

                    <p className="mt-3 text-sm text-[#64748B]">
                      {course.progress_percent || 0}% completed
                    </p>

                    <button
                      onClick={() => router.push(`/courses/${course.course_id}`)}
                      className="mt-5 w-full bg-[#FFD166] hover:bg-[#e6ba56] text-[#0F3D3E] font-bold py-3 rounded-2xl transition"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}