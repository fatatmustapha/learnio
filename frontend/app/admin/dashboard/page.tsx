"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalParents: 0,
    totalKids: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/dashboard-stats"
      );

      const data = await res.json();

      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFC] px-8 pt-32 pb-20">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}
          <div className="flex flex-col gap-6 mb-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-5xl font-bold text-[#0F3D3E]">
                Admin Dashboard
              </h1>

              <p className="mt-3 text-lg text-gray-600">
                Manage Learnio courses and platform activity.
              </p>
            </div>
             <Link
    href="/admin/courses"
    className="bg-[#0F3D3E] hover:bg-[#145254] text-white px-6 py-3 rounded-2xl font-semibold transition shadow-md"
  >
    Manage Courses
  </Link>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
            <div className="rounded-3xl bg-white p-10 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(46,196,182,0.22)]">
              <p className="text-2xl font-semibold text-gray-600">
                Total Parents
              </p>

              <h2 className="mt-6 text-2xl font-bold text-[#0F3D3E]">
                {stats.totalParents}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-10 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(46,196,182,0.22)]">
              <p className="text-2xl font-semibold text-gray-600">
                Total Kids
              </p>

              <h2 className="mt-6 text-2xl font-bold text-[#0F3D3E]">
                {stats.totalKids}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-10 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(46,196,182,0.22)]">
              <p className="text-2xl font-semibold text-gray-600">
                Total Courses
              </p>

              <h2 className="mt-6 text-2xl font-bold text-[#0F3D3E]">
                {stats.totalCourses}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-10 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(46,196,182,0.22)]">
              <p className="text-2xl font-semibold text-gray-600">
                Total Enrollments
              </p>

              <h2 className="mt-6 text-2xl font-bold text-[#0F3D3E]">
                {stats.totalEnrollments}
              </h2>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}