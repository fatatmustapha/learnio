"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center">
      {/* BACKGROUND IMAGE */}
      <img
        src="/images/hero.jpg"
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full"
      />

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CONTENT */}
      <div className="relative z-10 px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="text-[#FFD166]">Dream.</span>{" "}
          <span className="text-[#298f91]">Learn.</span>{" "}
          <span className="text-[#F25F5C]">Grow.</span>
        </h1>

        <p className="mb-6 text-lg text-white">
          Learnio teaches kids through interactive lessons, quizzes, and
          rewards.
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-4">
          <Link href="/signup">
            <button className="px-6 py-2 border-2 border-[#FFD166] text-[#FFD166] rounded-lg hover:bg-[#FFD166] hover:text-[#0F3D3E] transition">
              Sign Up
            </button>
          </Link>

          <Link href="/login">
            <button className="px-6 py-2 border-2 border-[#F25F5C] text-[#F25F5C] rounded-lg hover:bg-[#F25F5C] hover:text-white transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
