"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6">

        {/* Title */}
        <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-7xl">
          <span className="text-[color:var(--yellow)]">Dream.</span>{" "}
          <span className="text-[color:var(--green)]">Learn.</span>{" "}
          <span className="text-[color:var(--red)]">Grow.</span>
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg leading-relaxed text-gray-200 md:text-xl">
          Learnio teaches kids through interactive lessons, quizzes, and rewards.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">

          {/* SIGN UP */}
          <button className="
            px-8 py-3
            text-lg
            border-2
            border-[color:var(--yellow)]
            text-[color:var(--yellow)]
            rounded-xl
            transition-all duration-300
            hover:bg-[color:var(--yellow)]
            hover:text-black
          ">
            Sign Up
          </button>

          {/* LOGIN */}
          <button className="
            px-8 py-3
            text-lg
            border-2
            border-[color:var(--red)]
            text-[color:var(--red)]
            rounded-xl
            transition-all duration-300
            hover:bg-[color:var(--red)]
            hover:text-white
          ">
            Login
          </button>

        </div>

      </div>
    </section>
  );
}