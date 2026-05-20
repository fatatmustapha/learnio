"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@learnio.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Admin login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-6">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center w-[420px]">
          <h2 className="text-2xl font-bold text-[#0F3D3E] mb-8">
            Admin Login
          </h2>

          {error && (
            <div className="px-4 py-3 mb-4 text-sm text-red-600 rounded-lg bg-red-50">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="text-left">
              <label className="block text-sm font-semibold text-[#0F3D3E] mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@learnio.com"
                className="w-full border border-[#D9E2E1] rounded-lg px-5 py-3 outline-none focus:border-[#2EC4B6] transition"
              />
            </div>

            <div className="text-left">
              <label className="block text-sm font-semibold text-[#0F3D3E] mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-[#D9E2E1] rounded-lg px-5 py-3 outline-none focus:border-[#2EC4B6] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 bg-[#FFD166] hover:bg-[#e6b84f] text-white font-semibold py-3 rounded-lg transition transform active:scale-95 shadow-sm"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}