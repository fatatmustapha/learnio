"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Kid = {
  kid_id: number;
  child_name: string;
  username: string;
  age: number;
  level: number;
  earnedXp: number;
  totalXp: number;
  assignedCourses: number;
};

type DashboardData = {
  parent: {
    parent_id: number;
    name: string;
    email: string;
  };
  stats: {
    childrenCount: number;
    completedLessons: number;
  };
  kids: Kid[];
};

export default function ParentDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userRaw || !token) {
      router.push("/login/parent");
      return;
    }

    const user = JSON.parse(userRaw);

    if (user.role !== "parent") {
      router.push("/login/parent");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/parent/dashboard/${user.parent_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
          Loading dashboard...
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] pt-36 px-6">
        <p className="font-semibold text-center text-red-500">
          Could not load dashboard.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <section className="mb-8">
          <h1 className="text-4xl font-bold text-[#0F3D3E]">
            Parent Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome back, {data.parent.name}!
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <p className="text-sm text-gray-500">Children</p>
            <h2 className="mt-2 text-4xl font-bold text-[#0F3D3E]">
              {data.stats.childrenCount}
            </h2>
          </div>

          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <p className="text-sm text-gray-500">Total Completed Lessons</p>
            <h2 className="mt-2 text-4xl font-bold text-[#0F3D3E]">
              {data.stats.completedLessons}
            </h2>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[#0F3D3E]">
              Child Profiles
            </h2>

            <Link
              href="/parent/add-child"
              className="bg-[#FFD166] hover:bg-[#e6ba56] text-[#0F3D3E] font-bold px-5 py-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Add Child
            </Link>
          </div>

          {data.kids.length === 0 ? (
            <div className="p-10 text-center bg-white border border-gray-100 shadow-sm rounded-3xl">
              <p className="text-gray-500">
                No child profiles yet. Add your first child to begin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {data.kids.map((kid) => {
                const progress =
                  kid.totalXp > 0
                    ? Math.min((kid.earnedXp / kid.totalXp) * 100, 100)
                    : 0;

                return (
                  <div
                    key={kid.kid_id}
                    className="p-6 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-3xl hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="text-2xl font-bold text-[#0F3D3E]">
                          {kid.child_name || kid.username}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          @{kid.username}
                        </p>

                        <p className="text-sm text-gray-500">
                          Age {kid.age}
                        </p>
                      </div>

                      <span className="bg-[#FFF4D8] text-[#B88700] px-4 py-1 rounded-full text-sm font-bold">
                        Level {kid.level}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2">
                      <div className="bg-[#FFF4D8] rounded-2xl p-4">
                        <p className="text-xs text-[#8A6A00] font-semibold">
                          Assigned Courses
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#0F3D3E]">
                          {kid.assignedCourses}
                        </p>
                      </div>

                      <div className="bg-[#E8F7F6] rounded-2xl p-4">
                        <p className="text-xs text-[#0F3D3E] font-semibold">
                          XP Earned
                        </p>
                        <p className="mt-1 text-2xl font-bold text-[#0F3D3E]">
                          {kid.earnedXp}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-500">XP Progress</span>
                        <span className="font-semibold text-[#0F3D3E]">
                          {kid.earnedXp}/{kid.totalXp}
                        </span>
                      </div>

                      <div className="w-full h-3 overflow-hidden bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-[#2EC4B6] rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
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