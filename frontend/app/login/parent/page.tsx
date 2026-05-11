"use client";
// parent login

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ParentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Login successful!");

        setTimeout(() => {
          router.push("/parent/dashboard");
        }, 600);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-4">
      <div className="flex w-full max-w-5xl overflow-hidden bg-white shadow-lg rounded-2xl">
        <div className="w-full p-10 md:w-1/2">
          <h2 className="text-2xl font-bold text-[#2F3E34] mb-2">
            Welcome Back
          </h2>

          <p className="mb-6 text-gray-500">
            Login to continue your child’s learning journey
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFD166] transition"
              required
            />

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[#2F3E34] hover:text-[#FFD166] transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD166] text-[#2F3E34] py-3 rounded-lg font-semibold hover:bg-[#e6b84d] active:scale-95 transition disabled:opacity-70"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center text-[#0F3D3E] font-medium">
              {message}
            </p>
          )}

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