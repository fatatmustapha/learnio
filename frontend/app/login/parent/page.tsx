"use client";
//parent login
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login-parent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");

        // Save token (important for later)
        localStorage.setItem("token", data.token);

        // Redirect to dashboard (you can change this later)
        router.push("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-4">
      <div className="flex w-full max-w-5xl overflow-hidden bg-white shadow-lg rounded-2xl">
        {/* LEFT SIDE FORM */}
        <div className="w-full p-10 md:w-1/2">
          <h2 className="text-2xl font-bold text-[#2F3E34] mb-2">
            Welcome Back
          </h2>
          <p className="mb-6 text-gray-500">
            Login to continue your child’s learning journey
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition"
              required
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition"
              required
            />

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[#2F3E34] hover:text-[#FFD166] transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#FFD166] text-[#2F3E34] py-3 rounded-lg font-semibold hover:bg-[#e6b84d] active:scale-95 transition"
            >
              Login
            </button>
          </form>

          {/* SIGNUP */}
          <p className="mt-6 text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#2F3E34] font-semibold hover:text-[#FFD166]"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="hidden md:flex w-1/2 bg-[#FDF8F3] items-center justify-center">
          <img
            src="/images/login-parent.png"
            alt="Parent Login"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
