"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "token",
          data.token
        );

        setMessage("Account created successfully!");

        setTimeout(() => {
          router.push("/parent/dashboard");
        }, 1000);
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl h-[570px] bg-white rounded-3xl shadow-lg overflow-hidden flex">
        
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center w-full p-10 md:w-1/2">
          
          <h1 className="text-4xl font-bold text-[#0F3D3E] mb-3">
            Create Your Account
          </h1>

          <p className="mb-8 text-gray-500">
            Start your child’s learning journey
          </p>

          {/* IMPORTANT */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#FFD166]"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#FFD166]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#FFD166]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD166] hover:bg-[#f5c84c] transition-all duration-300 text-[#0F3D3E] font-semibold py-4 rounded-xl"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {message && (
            <p className="mt-5 text-center text-[#0F3D3E] font-medium">
              {message}
            </p>
          )}

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#F5A962] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative hidden md:block md:w-1/2">
          <img
            src="/images/signup-illustration.png"
            alt="Signup"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}