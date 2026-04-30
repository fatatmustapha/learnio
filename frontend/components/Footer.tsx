"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2FB3AA] mt-24">
      
      <div className="grid max-w-6xl gap-12 px-6 mx-auto py-14 md:grid-cols-3">

        {/* BRAND */}
        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-wide text-white">
            Learnio
          </h2>

          <p className="text-[#134E4A] text-base font-semibold leading-relaxed max-w-sm">
            Empowering children through engaging, structured learning experiences 
            that build confidence, curiosity, and real-world knowledge.
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-white">
            Explore
          </h3>

          <ul className="space-y-3 text-[#134E4A] text-base font-semibold">
            <li>
              <Link href="/" className="transition duration-200 hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link href="/about" className="transition duration-200 hover:text-white">
                About
              </Link>
            </li>

            <li>
              <Link href="/courses" className="transition duration-200 hover:text-white">
                Courses
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-white">
            Contact
          </h3>

          <p className="text-[#134E4A] text-base font-semibold mb-3">
            Email:{" "}
            <a
              href="mailto:learnio.education@gmail.com"
              className="underline transition hover:text-white"
            >
              learnio.education@gmail.com
            </a>
          </p>

          <p className="text-[#134E4A] text-base font-semibold mb-4">
            Location: Beirut, Lebanon
          </p>

          <div className="space-y-2 text-[#134E4A] text-base font-semibold">
            <p>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                className="transition hover:text-white"
              >
                Instagram
              </a>
            </p>

            <p>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                className="transition hover:text-white"
              >
                Facebook
              </a>
            </p>

            <p>
              <a
                href="https://x.com/"
                target="_blank"
                className="transition hover:text-white"
              >
                X (Twitter)
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-[#134E4A]/30 mx-6"></div>

      {/* BOTTOM */}
      <div className="text-center py-5 text-sm text-[#134E4A] font-medium">
        © {new Date().getFullYear()} Learnio. All rights reserved.
      </div>

    </footer>
  );
}