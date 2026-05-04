"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { token } = useParams(); // get token from URL
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Password reset successful ✅");

        // redirect to login
        router.push("/login/parent");

      } else {
        alert(data.message || "Error resetting password");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-4">
      <div className="flex w-full max-w-5xl overflow-hidden bg-white shadow-lg rounded-2xl">

        {/* LEFT SIDE */}
        <div className="w-full p-10 md:w-1/2">
          <h2 className="text-2xl font-bold text-[#2F3E34] mb-2">
            Reset Password
          </h2>
          <p className="mb-6 text-gray-500">
            Enter your new password below
          </p>

          <form onSubmit={handleReset} className="space-y-4">

            {/* PASSWORD INPUT */}
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
              required
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD166] text-[#2F3E34] py-3 rounded-lg font-semibold hover:bg-[#e6b84d] active:scale-95 transition"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:flex w-1/2 bg-[#FDF8F3] items-center justify-center">
          <img
            src="/images/signup-illustration.png"
            alt="Reset Password"
            className="object-cover w-full h-full"
          />
        </div>

      </div>
    </div>
  );
}