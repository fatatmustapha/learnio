"use client";

import Navbar from "@/components/shared/Navbar";

export default function AdminDashboardPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FDF8F3] px-8 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0F3D3E]">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Welcome to the Learnio admin platform.
          </p>
        </div>
      </main>
    </>
  );
}