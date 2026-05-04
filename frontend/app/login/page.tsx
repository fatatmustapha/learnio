"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center w-[420px]">

        <h2 className="text-2xl font-bold text-[#0F3D3E] mb-6">
          Choose Login Type
        </h2>

        <div className="flex flex-col gap-4">

          {/* 🎨 KID LOGIN (COLORFUL PRIMARY) */}
          <Link
            href="/login/kid"
            className="bg-[#FFD166] hover:bg-[#e6b84f] text-black font-semibold py-3 rounded-lg transition transform active:scale-95 shadow-sm"
          >
            Kid Login
          </Link>

          {/* 🧑‍💼 PARENT LOGIN (BASIC SECONDARY) */}
          <Link
            href="/login/parent"
            className="border border-[#0F3D3E] text-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white py-3 rounded-lg transition transform active:scale-95"
          >
            Parent Login
          </Link>

        </div>

      </div>
    </div>
  );
}